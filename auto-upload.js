const fs = require('fs');
const path = require('path');

// Путь к папке с фотографиями
const PHOTOS_FOLDER = './images/portfolio/primer';
const DATA_FILE = './data/existing-photos.json';

// Функция для добавления новых фотографий
function addNewPhotos() {
    console.log('🔍 Проверяем фотографии в папке primer...');
    
    // Проверяем, существует ли папка
    if (!fs.existsSync(PHOTOS_FOLDER)) {
        console.log('❌ Папка images/portfolio/primer не найдена');
        return;
    }
    
    // Читаем существующие данные
    let existingPhotos = [];
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        existingPhotos = JSON.parse(data);
    }
    
    // Получаем список файлов в папке primer
    const files = fs.readdirSync(PHOTOS_FOLDER);
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });
    
    if (imageFiles.length === 0) {
        console.log('✅ Фотографий в папке primer нет');
        return;
    }
    
    console.log(`📸 Найдено ${imageFiles.length} фотографий в папке primer:`);
    
    // Очищаем старые данные
    existingPhotos = [];
    
    imageFiles.forEach((file, index) => {
        // Определяем категорию по имени файла
        let category = 'маникюр'; // по умолчанию
        const fileName = file.toLowerCase();
        
        // Если в названии есть ключевые слова для стрижек
        if (fileName.includes('волос') || fileName.includes('стрижк') || fileName.includes('окрашивани') || fileName.includes('мелировани') || fileName.includes('ламинировани') || fileName.includes('колористик')) {
            category = 'стрижки';
        }
        
        // Создаем новую запись
        const newPhoto = {
            id: index + 1, // простой ID
            category: category,
            src: `images/portfolio/primer/${file}`,
            fileName: file,
            description: `Пример работы - ${path.parse(file).name}`,
            uploadDate: new Date().toISOString()
        };
        
        existingPhotos.push(newPhoto);
        console.log(`✅ Добавлена: ${file} (категория: ${category})`);
    });
    
    // Сохраняем обновленные данные
    fs.writeFileSync(DATA_FILE, JSON.stringify(existingPhotos, null, 2));
    console.log(`\n🎉 Добавлено ${existingPhotos.length} фотографий!`);
    console.log(`📊 Всего фотографий: ${existingPhotos.length}`);
}

// Функция для очистки данных (удаляет все фотографии из JSON)
function clearData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    console.log('✅ Данные очищены');
}

// Обработка аргументов командной строки
const args = process.argv.slice(2);

if (args.includes('--clear')) {
    clearData();
} else {
    addNewPhotos();
}

module.exports = { addNewPhotos, clearData };
