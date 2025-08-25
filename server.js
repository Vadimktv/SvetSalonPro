const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Импортируем API для портфолио
const portfolioAPI = require('./pages/api/portfolio-photos.js');

// Импортируем API для загрузки фотографий
const uploadPhotosAPI = require('./pages/api/upload-photos.js');

// MIME типы для статических файлов
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf'
};

// Создаем HTTP сервер
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`${req.method} ${pathname}`);
    
    // Обработка API запросов для портфолио
    if (pathname === '/api/portfolio-photos.js' || pathname === '/pages/api/portfolio-photos.js') {
        portfolioAPI.handleRequest(req, res);
        return;
    }
    
    // Обработка API запросов для загрузки фотографий
    if (pathname === '/api/upload-photos.js' || pathname === '/pages/api/upload-photos.js') {
        uploadPhotosAPI.handleRequest(req, res);
        return;
    }
    
    // Обработка статических файлов фотографий
    if (pathname.startsWith('/uploads/photos/')) {
        const photoPath = path.join(__dirname, pathname);
        fs.readFile(photoPath, (error, content) => {
            if (error) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Photo not found');
            } else {
                const extname = path.extname(photoPath).toLowerCase();
                const contentType = mimeTypes[extname] || 'image/jpeg';
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
        return;
    }
    
    // Определяем путь к файлу
    let filePath = decodeURIComponent(pathname);
    
    // Если запрос к корню, показываем index.html
    if (pathname === '/') {
        filePath = '/index.html';
    }
    
    // Добавляем точку в начало пути для статических файлов
    if (!filePath.startsWith('/pages/')) {
        filePath = '.' + filePath;
    }
    
    // Получаем расширение файла
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Читаем файл
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Файл не найден
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Файл не найден</h1>');
            } else {
                // Ошибка сервера
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - Внутренняя ошибка сервера</h1>');
            }
        } else {
            // Успешный ответ
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Порт сервера
const PORT = process.env.PORT || 3000;

// Запускаем сервер
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Откройте http://localhost:${PORT} в браузере`);
    console.log('API для портфолио доступен по адресу: /api/portfolio-photos.js');
    console.log('API для загрузки фотографий доступен по адресу: /api/upload-photos.js');
});

// Обработка ошибок сервера
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Порт ${PORT} уже используется. Попробуйте другой порт.`);
    } else {
        console.error('Ошибка сервера:', error);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nПолучен сигнал SIGINT. Завершение работы сервера...');
    server.close(() => {
        console.log('Сервер остановлен.');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\nПолучен сигнал SIGTERM. Завершение работы сервера...');
    server.close(() => {
        console.log('Сервер остановлен.');
        process.exit(0);
    });
});
