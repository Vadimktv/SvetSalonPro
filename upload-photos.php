<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Создаем папки если их нет
$uploadsDir = 'uploads/photos/';
$dataDir = 'data/';

if (!file_exists($uploadsDir)) {
    mkdir($uploadsDir, 0755, true);
}

if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$photosFile = $dataDir . 'photos.json';

// Функция для загрузки существующих фотографий
function loadPhotos() {
    global $photosFile;
    if (file_exists($photosFile)) {
        $data = file_get_contents($photosFile);
        return json_decode($data, true) ?: [];
    }
    return [];
}

// Функция для сохранения фотографий
function savePhotos($photos) {
    global $photosFile;
    return file_put_contents($photosFile, json_encode($photos, JSON_PRETTY_PRINT));
}

// Функция для сохранения base64 изображения
function saveBase64Image($base64Data, $fileName) {
    global $uploadsDir;
    
    // Убираем префикс data:image/...;base64,
    $base64Image = preg_replace('/^data:image\/[a-z]+;base64,/', '', $base64Data);
    $imageData = base64_decode($base64Image);
    
    if ($imageData === false) {
        return false;
    }
    
    // Генерируем уникальное имя файла
    $timestamp = time();
    $randomId = substr(md5(uniqid()), 0, 8);
    $extension = pathinfo($fileName, PATHINFO_EXTENSION) ?: 'jpg';
    $newFileName = $timestamp . '_' . $randomId . '.' . $extension;
    $filePath = $uploadsDir . $newFileName;
    
    if (file_put_contents($filePath, $imageData)) {
        return $newFileName;
    }
    
    return false;
}

// Обработка POST запроса для загрузки фотографий
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data || !isset($data['category']) || !isset($data['src']) || !isset($data['fileName'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Missing required fields'
        ]);
        exit;
    }
    
    // Сохраняем изображение
    $savedFileName = saveBase64Image($data['src'], $data['fileName']);
    if (!$savedFileName) {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to save image'
        ]);
        exit;
    }
    
    // Загружаем существующие фотографии
    $existingPhotos = loadPhotos();
    
    // Создаем новую запись о фотографии
    $newPhoto = [
        'id' => time() . rand(1000, 9999),
        'category' => $data['category'],
        'src' => $uploadsDir . $savedFileName,
        'fileName' => $data['fileName'],
        'description' => $data['description'] ?? '',
        'uploadDate' => date('c')
    ];
    
    // Добавляем новую фотографию
    $existingPhotos[] = $newPhoto;
    
    // Сохраняем обновленные данные
    if (savePhotos($existingPhotos)) {
        echo json_encode([
            'success' => true,
            'photo' => $newPhoto,
            'message' => 'Photo uploaded successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to save photo data'
        ]);
    }
}

// Обработка GET запроса для получения фотографий
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $photos = loadPhotos();
    echo json_encode([
        'success' => true,
        'photos' => $photos
    ]);
}
?>
