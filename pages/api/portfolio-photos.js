const fs = require('fs');
const path = require('path');

// Путь к файлу с фотографиями
const PORTFOLIO_FILE = path.join(__dirname, 'portfolio-photos.json');

// Инициализация файла, если он не существует
function initPortfolioFile() {
    if (!fs.existsSync(PORTFOLIO_FILE)) {
        const initialData = {
            hair: [],
            manicure: []
        };
        fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(initialData, null, 2));
    }
}

// Получение всех фотографий
function getPortfolioPhotos() {
    try {
        initPortfolioFile();
        const data = fs.readFileSync(PORTFOLIO_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Ошибка чтения файла портфолио:', error);
        return { hair: [], manicure: [] };
    }
}

// Сохранение фотографий
function savePortfolioPhotos(photos) {
    try {
        initPortfolioFile();
        fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(photos, null, 2));
        return true;
    } catch (error) {
        console.error('Ошибка сохранения файла портфолио:', error);
        return false;
    }
}

// Добавление новой фотографии
function addPhoto(category, photoData) {
    try {
        const photos = getPortfolioPhotos();
        
        if (!photos[category]) {
            photos[category] = [];
        }
        
        const newPhoto = {
            id: Date.now() + Math.random(),
            src: photoData.src,
            category: category,
            uploadedAt: new Date().toISOString(),
            fileName: photoData.fileName || 'photo.jpg',
            description: photoData.description || ''
        };
        
        photos[category].push(newPhoto);
        
        if (savePortfolioPhotos(photos)) {
            return { success: true, photo: newPhoto };
        } else {
            return { success: false, error: 'Ошибка сохранения' };
        }
    } catch (error) {
        console.error('Ошибка добавления фотографии:', error);
        return { success: false, error: error.message };
    }
}

// Обновление фотографии
function updatePhoto(photoId, updates) {
    try {
        const photos = getPortfolioPhotos();
        let found = false;
        
        Object.keys(photos).forEach(category => {
            const photoIndex = photos[category].findIndex(photo => photo.id == photoId);
            if (photoIndex !== -1) {
                photos[category][photoIndex] = { ...photos[category][photoIndex], ...updates };
                found = true;
            }
        });
        
        if (found && savePortfolioPhotos(photos)) {
            return { success: true };
        } else {
            return { success: false, error: 'Фотография не найдена' };
        }
    } catch (error) {
        console.error('Ошибка обновления фотографии:', error);
        return { success: false, error: error.message };
    }
}

// Удаление фотографии
function deletePhoto(photoId) {
    try {
        const photos = getPortfolioPhotos();
        let found = false;
        
        Object.keys(photos).forEach(category => {
            const photoIndex = photos[category].findIndex(photo => photo.id == photoId);
            if (photoIndex !== -1) {
                photos[category].splice(photoIndex, 1);
                found = true;
            }
        });
        
        if (found && savePortfolioPhotos(photos)) {
            return { success: true };
        } else {
            return { success: false, error: 'Фотография не найдена' };
        }
    } catch (error) {
        console.error('Ошибка удаления фотографии:', error);
        return { success: false, error: error.message };
    }
}

// Обработка HTTP запросов
function handleRequest(req, res) {
    // Устанавливаем CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Обработка preflight запросов
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    try {
        switch (req.method) {
            case 'GET':
                // Получение всех фотографий
                const photos = getPortfolioPhotos();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(photos));
                break;
                
            case 'POST':
                // Добавление новой фотографии
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                
                req.on('end', () => {
                    try {
                        const photoData = JSON.parse(body);
                        const { category, ...photoInfo } = photoData;
                        
                        if (!category || !photoInfo.src) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, error: 'Неверные данные' }));
                            return;
                        }
                        
                        const result = addPhoto(category, photoInfo);
                        res.writeHead(result.success ? 200 : 400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                    } catch (error) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Неверный JSON' }));
                    }
                });
                break;
                
            case 'PUT':
                // Обновление фотографии
                let updateBody = '';
                req.on('data', chunk => {
                    updateBody += chunk.toString();
                });
                
                req.on('end', () => {
                    try {
                        const updateData = JSON.parse(updateBody);
                        const { photoId, ...updates } = updateData;
                        
                        if (!photoId) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, error: 'ID фотографии не указан' }));
                            return;
                        }
                        
                        const result = updatePhoto(photoId, updates);
                        res.writeHead(result.success ? 200 : 400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                    } catch (error) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Неверный JSON' }));
                    }
                });
                break;
                
            case 'DELETE':
                // Удаление фотографии
                const url = new URL(req.url, `http://${req.headers.host}`);
                const photoId = url.searchParams.get('id');
                
                if (!photoId) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'ID фотографии не указан' }));
                    return;
                }
                
                const deleteResult = deletePhoto(photoId);
                res.writeHead(deleteResult.success ? 200 : 400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(deleteResult));
                break;
                
            default:
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Метод не поддерживается' }));
        }
    } catch (error) {
        console.error('Ошибка обработки запроса:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Внутренняя ошибка сервера' }));
    }
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleRequest,
        getPortfolioPhotos,
        addPhoto,
        updatePhoto,
        deletePhoto
    };
}

// Если файл запущен напрямую (для тестирования)
if (require.main === module) {
    console.log('API для управления фотографиями портфолио');
    console.log('Доступные функции:');
    console.log('- GET: получение всех фотографий');
    console.log('- POST: добавление новой фотографии');
    console.log('- PUT: обновление фотографии');
    console.log('- DELETE: удаление фотографии');
}
