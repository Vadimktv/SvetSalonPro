// API для загрузки фотографий
const fs = require('fs');
const path = require('path');

// Функция для обработки HTTP запросов
function handleRequest(req, res) {
    const method = req.method;
    
    if (method === 'POST') {
        handleUpload(req, res);
    } else if (method === 'GET') {
        handleGetPhotos(req, res);
    } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
    }
}

// Создаем папку для фотографий, если её нет
const photosDir = path.join(__dirname, '../../uploads/photos');
if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, { recursive: true });
}

// Файл для хранения данных о фотографиях
const photosDataFile = path.join(__dirname, '../../data/photos.json');

// Создаем папку для данных, если её нет
const dataDir = path.dirname(photosDataFile);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Функция для загрузки существующих фотографий
function loadPhotosData() {
    try {
        if (fs.existsSync(photosDataFile)) {
            const data = fs.readFileSync(photosDataFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading photos data:', error);
    }
    return [];
}

// Функция для сохранения данных о фотографиях
function savePhotosData(photos) {
    try {
        fs.writeFileSync(photosDataFile, JSON.stringify(photos, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving photos data:', error);
        return false;
    }
}

// Функция для сохранения base64 изображения в файл
function saveBase64Image(base64Data, fileName) {
    try {
        // Убираем префикс data:image/...;base64,
        const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
        const buffer = Buffer.from(base64Image, 'base64');
        
        // Генерируем уникальное имя файла
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        const extension = path.extname(fileName) || '.jpg';
        const newFileName = `${timestamp}_${randomId}${extension}`;
        const filePath = path.join(photosDir, newFileName);
        
        fs.writeFileSync(filePath, buffer);
        return newFileName;
    } catch (error) {
        console.error('Error saving image:', error);
        return null;
    }
}

// Обработка POST запроса для загрузки фотографий
function handleUpload(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const photoData = JSON.parse(body);
            const { category, src, fileName, description } = photoData;
            
            // Проверяем обязательные поля
            if (!category || !src || !fileName) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Missing required fields'
                }));
                return;
            }
            
            // Сохраняем изображение
            const savedFileName = saveBase64Image(src, fileName);
            if (!savedFileName) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Failed to save image'
                }));
                return;
            }
            
            // Загружаем существующие фотографии
            const existingPhotos = loadPhotosData();
            
            // Создаем новую запись о фотографии
            const newPhoto = {
                id: Date.now() + Math.random(),
                category: category,
                src: `/uploads/photos/${savedFileName}`,
                fileName: fileName,
                description: description || '',
                uploadDate: new Date().toISOString()
            };
            
            // Добавляем новую фотографию
            existingPhotos.push(newPhoto);
            
            // Сохраняем обновленные данные
            if (savePhotosData(existingPhotos)) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    photo: newPhoto,
                    message: 'Photo uploaded successfully'
                }));
            } else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Failed to save photo data'
                }));
            }
            
        } catch (error) {
            console.error('Error processing request:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Invalid request data'
            }));
        }
    });
}

// Обработка GET запроса для получения фотографий
function handleGetPhotos(req, res) {
    try {
        const photos = loadPhotosData();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            photos: photos
        }));
        
    } catch (error) {
        console.error('Error loading photos:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            error: 'Failed to load photos'
        }));
    }
}

// Экспортируем функцию для обработки запросов
module.exports = { handleRequest };
