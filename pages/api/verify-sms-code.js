// API для проверки SMS-кода
const http = require('http');
const smsStorage = require('./sms-storage.js');

function handleRequest(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const { email, code } = JSON.parse(body);

            if (!email || !code) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Email and code are required' }));
                return;
            }

            // Проверяем код через хранилище
            const verification = smsStorage.verifyCode(email, code);
            
            if (!verification.valid) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: verification.error }));
                return;
            }

            // Код верный - создаем пользователя или получаем существующего
            const user = {
                id: 'user_' + Date.now(),
                email: email,
                created_at: new Date().toISOString(),
                user_metadata: {
                    name: email.split('@')[0],
                    phone: '+7 (___) ___-__-__'
                }
            };

            // Код уже удален в verifyCode

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                message: 'Код подтвержден',
                user: user
            }));

        } catch (error) {
            console.error('Error verifying SMS code:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                error: 'Ошибка проверки SMS-кода',
                details: error.message 
            }));
        }
    });
}

// Экспортируем функцию для использования в server.js
module.exports = { handleRequest };
