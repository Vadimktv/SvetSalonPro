const SUPABASE_CONFIG = require('../../supabase-config.js');

const SUPABASE_URL = (SUPABASE_CONFIG?.url || '').replace(/\/+$/, '');
const SUPABASE_ANON_KEY = SUPABASE_CONFIG?.anonKey || '';
const DEFAULT_REDIRECT = SUPABASE_CONFIG?.auth?.redirectTo || 'https://www.svetsalonpro.ru/pages/account.html';
const MAGIC_LINK_ENDPOINT = SUPABASE_URL ? `${SUPABASE_URL}/auth/v1/magiclink` : null;

const ALLOWED_REDIRECT_HOSTS = new Set([
    'www.svetsalonpro.ru',
    'svetsalonpro.ru',
    'localhost',
    '127.0.0.1'
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function normalizeAccountPath(url) {
    const normalized = new URL(url.toString());
    if (normalized.pathname !== '/pages/account.html') {
        normalized.pathname = '/pages/account.html';
        normalized.search = '';
        normalized.hash = '';
    }
    return normalized.toString();
}

function resolveRedirectUrl(req, providedRedirect) {
    const fallback = (() => {
        try {
            const fallbackUrl = new URL(DEFAULT_REDIRECT);
            return normalizeAccountPath(fallbackUrl);
        } catch (error) {
            return 'https://www.svetsalonpro.ru/pages/account.html';
        }
    })();

    const tryParse = (value) => {
        if (!value) return null;
        try {
            const candidate = new URL(value);
            if (!ALLOWED_REDIRECT_HOSTS.has(candidate.hostname)) {
                return null;
            }
            return normalizeAccountPath(candidate);
        } catch (error) {
            return null;
        }
    };

    const fromBody = tryParse(providedRedirect);
    if (fromBody) {
        return fromBody;
    }

    const host = req?.headers?.host;
    if (host) {
        const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
        const originCandidate = `${protocol}://${host}/pages/account.html`;
        const resolved = tryParse(originCandidate);
        if (resolved) {
            return resolved;
        }
    }

    const originHeader = req?.headers?.origin;
    if (originHeader) {
        const resolved = tryParse(`${originHeader.replace(/\/$/, '')}/pages/account.html`);
        if (resolved) {
            return resolved;
        }
    }

    return fallback;
}

async function forwardMagicLink(email, redirectUrl) {
    if (!MAGIC_LINK_ENDPOINT || !SUPABASE_ANON_KEY) {
        const error = new Error('Supabase configuration is missing');
        error.status = 500;
        throw error;
    }

    const response = await fetch(MAGIC_LINK_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
            email,
            redirect_to: redirectUrl,
            should_create_user: true
        })
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const message = typeof payload === 'string'
            ? payload
            : payload?.msg || payload?.error_description || payload?.error || payload?.message || 'Не удалось отправить ссылку';

        const error = new Error(message);
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
}

function handleRequest(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
        return;
    }

    let rawBody = '';

    req.on('data', (chunk) => {
        rawBody += chunk.toString();
    });

    req.on('error', (error) => {
        console.error('Error reading magic link request body:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Некорректный запрос' }));
    });

    req.on('end', async () => {
        let payload = {};

        if (rawBody.trim().length > 0) {
            try {
                payload = JSON.parse(rawBody);
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Тело запроса должно быть в формате JSON' }));
                return;
            }
        }

        const email = (payload.email || '').toString().trim().toLowerCase();

        if (!EMAIL_REGEX.test(email)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Укажите корректный email' }));
            return;
        }

        const redirectUrl = resolveRedirectUrl(req, payload.redirectTo || payload.redirect_to);

        try {
            await forwardMagicLink(email, redirectUrl);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Ссылка для входа отправлена на email',
                redirectTo: redirectUrl
            }));
        } catch (error) {
            console.error('Magic link proxy error:', error);
            const statusCode = Number.isInteger(error.status) ? error.status : 502;
            const responseBody = {
                success: false,
                error: error.message || 'Не удалось отправить ссылку'
            };

            if (error.payload && typeof error.payload === 'object' && Object.keys(error.payload).length > 0) {
                responseBody.details = error.payload;
            }

            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(responseBody));
        }
    });
}

module.exports = { handleRequest };
