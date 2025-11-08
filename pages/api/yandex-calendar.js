const https = require('https');
const { URL } = require('url');

// Конфигурация Яндекс Календаря
// Эти значения нужно будет настроить в переменных окружения
const YANDEX_CALENDAR_CONFIG = {
    // OAuth токен доступа (получается через OAuth авторизацию)
    accessToken: process.env.YANDEX_CALENDAR_TOKEN || '',
    // ID календаря Светланы (можно получить через API)
    calendarId: process.env.YANDEX_CALENDAR_ID || '',
    // API endpoint
    apiUrl: 'https://calendar.yandex.ru/api/v1'
};

/**
 * Получает занятые времена из Яндекс Календаря на указанную дату
 */
async function getBusyTimesFromYandexCalendar(date) {
    if (!YANDEX_CALENDAR_CONFIG.accessToken || !YANDEX_CALENDAR_CONFIG.calendarId) {
        console.warn('Яндекс Календарь не настроен. Пропускаем проверку.');
        return [];
    }

    try {
        // Форматируем дату для запроса (нужен диапазон времени на весь день)
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        // Форматируем даты в ISO 8601
        const startISO = startDate.toISOString();
        const endISO = endDate.toISOString();

        // URL для получения событий календаря
        const url = `${YANDEX_CALENDAR_CONFIG.apiUrl}/calendars/${YANDEX_CALENDAR_CONFIG.calendarId}/events?start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}`;

        const response = await new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const options = {
                hostname: urlObj.hostname,
                path: urlObj.pathname + urlObj.search,
                method: 'GET',
                headers: {
                    'Authorization': `OAuth ${YANDEX_CALENDAR_CONFIG.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, json: () => Promise.resolve(JSON.parse(data)) });
                });
            });

            req.on('error', reject);
            req.end();
        });

        if (!response.ok) {
            console.error('Ошибка при получении событий из Яндекс Календаря:', response.status);
            return [];
        }

        const data = await response.json();
        
        // Извлекаем занятые времена
        const busyTimes = [];
        if (data.items && Array.isArray(data.items)) {
            data.items.forEach(event => {
                if (event.start && event.end) {
                    const startTime = new Date(event.start);
                    const endTime = new Date(event.end);
                    
                    // Преобразуем в формат HH:MM
                    const startTimeStr = `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}`;
                    const endTimeStr = `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;
                    
                    busyTimes.push({
                        start: startTimeStr,
                        end: endTimeStr,
                        title: event.summary || 'Занято'
                    });
                }
            });
        }

        return busyTimes;
    } catch (error) {
        console.error('Ошибка при работе с Яндекс Календарем:', error);
        return [];
    }
}

/**
 * Проверяет, занято ли указанное время в Яндекс Календаре
 */
async function isTimeBusyInYandexCalendar(date, time, durationMinutes = 60) {
    const busyTimes = await getBusyTimesFromYandexCalendar(date);
    
    if (busyTimes.length === 0) {
        return false;
    }

    // Парсим время начала записи
    const [hours, minutes] = time.split(':').map(Number);
    const bookingStart = new Date(date);
    bookingStart.setHours(hours, minutes, 0, 0);
    const bookingEnd = new Date(bookingStart.getTime() + durationMinutes * 60000);

    // Проверяем пересечение с занятыми временами
    for (const busySlot of busyTimes) {
        const [busyStartHours, busyStartMinutes] = busySlot.start.split(':').map(Number);
        const [busyEndHours, busyEndMinutes] = busySlot.end.split(':').map(Number);
        
        const busyStart = new Date(date);
        busyStart.setHours(busyStartHours, busyStartMinutes, 0, 0);
        const busyEnd = new Date(date);
        busyEnd.setHours(busyEndHours, busyEndMinutes, 0, 0);

        // Проверяем пересечение временных интервалов
        if (bookingStart < busyEnd && bookingEnd > busyStart) {
            return true; // Время занято
        }
    }

    return false; // Время свободно
}

/**
 * Создает событие в Яндекс Календаре
 */
async function createEventInYandexCalendar(title, description, date, time, durationMinutes = 60) {
    if (!YANDEX_CALENDAR_CONFIG.accessToken || !YANDEX_CALENDAR_CONFIG.calendarId) {
        console.warn('Яндекс Календарь не настроен. Пропускаем создание события.');
        return { success: false, message: 'Яндекс Календарь не настроен' };
    }

    try {
        // Форматируем дату и время
        const [hours, minutes] = time.split(':').map(Number);
        const startDate = new Date(date);
        startDate.setHours(hours, minutes, 0, 0);
        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

        const startISO = startDate.toISOString();
        const endISO = endDate.toISOString();

        // Адрес салона
        const location = 'г. Геленджик, ул. Одесская, 3А, корпус 10';

        // Тело запроса для создания события
        const eventData = {
            summary: title,
            description: description,
            start: startISO,
            end: endISO,
            location: location
        };

        const url = `${YANDEX_CALENDAR_CONFIG.apiUrl}/calendars/${YANDEX_CALENDAR_CONFIG.calendarId}/events`;

        const response = await new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const postData = JSON.stringify(eventData);
            const options = {
                hostname: urlObj.hostname,
                path: urlObj.pathname,
                method: 'POST',
                headers: {
                    'Authorization': `OAuth ${YANDEX_CALENDAR_CONFIG.accessToken}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    resolve({ 
                        status: res.statusCode, 
                        ok: res.statusCode >= 200 && res.statusCode < 300, 
                        json: () => Promise.resolve(JSON.parse(data || '{}'))
                    });
                });
            });

            req.on('error', reject);
            req.write(postData);
            req.end();
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Ошибка при создании события в Яндекс Календаре:', response.status, errorData);
            return { success: false, message: `Ошибка создания события: ${response.status}` };
        }

        const data = await response.json();
        return { success: true, eventId: data.id, data };
    } catch (error) {
        console.error('Ошибка при создании события в Яндекс Календаре:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Обработчик HTTP запросов
 */
function handleRequest(req, res) {
    const url = require('url');
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    const pathname = parsedUrl.pathname;

    // CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Получение занятых времен
    if (req.method === 'GET' && pathname.includes('busy-times')) {
        const { date } = query;
        
        if (!date) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Параметр date обязателен' }));
            return;
        }

        getBusyTimesFromYandexCalendar(date)
            .then(busyTimes => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, busyTimes }));
            })
            .catch(error => {
                console.error('Ошибка:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: error.message }));
            });
        return;
    }

    // Проверка доступности времени
    if (req.method === 'GET' && pathname.includes('check-time')) {
        const { date, time, duration } = query;
        
        if (!date || !time) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Параметры date и time обязательны' }));
            return;
        }

        const durationMinutes = duration ? parseInt(duration) : 60;
        
        isTimeBusyInYandexCalendar(date, time, durationMinutes)
            .then(isBusy => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, isBusy, available: !isBusy }));
            })
            .catch(error => {
                console.error('Ошибка:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: error.message }));
            });
        return;
    }

    // Создание события
    if (req.method === 'POST' && pathname.includes('create-event')) {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const { title, description, date, time, duration } = JSON.parse(body);
                
                if (!title || !date || !time) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Параметры title, date и time обязательны' }));
                    return;
                }

                const durationMinutes = duration ? parseInt(duration) : 60;
                
                createEventInYandexCalendar(title, description, date, time, durationMinutes)
                    .then(result => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                    })
                    .catch(error => {
                        console.error('Ошибка:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: error.message }));
                    });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Неверный формат данных' }));
            }
        });
        return;
    }

    // Неизвестный endpoint
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Endpoint не найден' }));
}

module.exports = {
    handleRequest,
    getBusyTimesFromYandexCalendar,
    isTimeBusyInYandexCalendar,
    createEventInYandexCalendar
};

