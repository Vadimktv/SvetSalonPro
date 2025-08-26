# Установка Reviews Stack Component в SvetSalonPro

## 🚀 Быстрая установка

### 1. Скопируйте файлы компонента

Убедитесь, что все файлы компонента находятся в папке `components/reviews-stack/`:

```
components/reviews-stack/
├── reviews-stack.css      # Стили компонента
├── reviews-stack.js       # JavaScript логика
├── reviews-stack.html     # Демо-страница
├── integration-example.html # Пример интеграции
├── README.md              # Подробная документация
├── INTEGRATION_GUIDE.md   # Краткая инструкция
└── KEY_CODE_SNIPPETS.md   # Ключевые фрагменты кода
```

### 2. Добавьте в существующую страницу

В файл `index.html` добавьте в секцию `<head>`:

```html
<link rel="stylesheet" href="components/reviews-stack/reviews-stack.css">
```

### 3. Добавьте HTML разметку

Найдите подходящее место в `index.html` (например, после секции услуг) и добавьте:

```html
<!-- Секция отзывов -->
<section class="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
    <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Отзывы наших клиентов
        </h2>
        <p class="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Узнайте, что говорят о нас довольные клиенты. Каждый отзыв — это история успешного преображения.
        </p>
        
        <!-- Компонент отзывов -->
        <div class="reviews" id="reviewsRoot"></div>
        
        <!-- Кнопки управления -->
        <div class="text-center mt-8 space-x-4">
            <button class="btn-secondary" id="prevBtn">
                <i class="fas fa-chevron-left mr-2"></i>Назад
            </button>
            <button class="btn-primary" id="nextBtn">
                Вперед<i class="fas fa-chevron-right ml-2"></i>
            </button>
        </div>
    </div>
</section>
```

### 4. Добавьте JavaScript инициализацию

В конец файла `index.html` перед `</body>` добавьте:

```html
<script type="module">
    import { ReviewsStack, defaultReviewsData } from './components/reviews-stack/reviews-stack.js';
    
    // Инициализация компонента отзывов
    const reviewsRoot = document.getElementById('reviewsRoot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (reviewsRoot) {
        const stack = new ReviewsStack(reviewsRoot, {
            data: defaultReviewsData,
            loop: true,
            cardsInDom: 4,
            onChange: (index, review) => {
                console.log('Показан отзыв:', review.author);
            }
        });
        
        // Обработчики кнопок
        if (prevBtn) {
            prevBtn.addEventListener('click', () => stack.prev());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => stack.next());
        }
        
        // Глобальная переменная для отладки
        window.reviewsStack = stack;
    }
</script>
```

### 5. Адаптация под дизайн сайта

Добавьте в секцию `<style>` в `index.html`:

```css
/* Адаптация компонента под дизайн SvetSalonPro */
:root {
    --card-width: 380px;
    --card-height: 220px;
    --card-radius: 20px;
    --card-shadow-1: 0 4px 20px rgba(236, 72, 153, 0.1);
    --card-shadow-2: 0 2px 10px rgba(236, 72, 153, 0.05);
    --card-shadow-active: 0 8px 30px rgba(236, 72, 153, 0.15);
    --star-filled: #ec4899;
    --card-bg: #ffffff;
    --card-border: #fce7f3;
}

/* Стили для кнопок управления */
.btn-primary {
    @apply bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300;
}

.btn-secondary {
    @apply bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200;
}
```

## 🎯 Альтернативные варианты интеграции

### Вариант 1: Отдельная страница отзывов

Создайте файл `pages/reviews.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Отзывы - SvetSalonPro</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../components/reviews-stack/reviews-stack.css">
    <style>
        :root {
            --card-width: 400px;
            --card-height: 240px;
            --star-filled: #ec4899;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen">
    <div class="container mx-auto px-4 py-16">
        <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Отзывы клиентов</h1>
        <div class="reviews" id="reviewsRoot"></div>
    </div>
    
    <script type="module">
        import { ReviewsStack, defaultReviewsData } from '../components/reviews-stack/reviews-stack.js';
        
        const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
            data: defaultReviewsData
        });
    </script>
</body>
</html>
```

### Вариант 2: Модальное окно с отзывами

Добавьте кнопку для открытия модального окна:

```html
<button class="btn-primary" onclick="openReviewsModal()">
    <i class="fas fa-star mr-2"></i>Посмотреть отзывы
</button>

<!-- Модальное окно -->
<div id="reviewsModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
    <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Отзывы клиентов</h2>
            <button onclick="closeReviewsModal()" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times text-xl"></i>
            </button>
        </div>
        <div class="reviews" id="reviewsRoot"></div>
    </div>
</div>

<script type="module">
    import { ReviewsStack, defaultReviewsData } from './components/reviews-stack/reviews-stack.js';
    
    let reviewsStack;
    
    window.openReviewsModal = function() {
        document.getElementById('reviewsModal').classList.remove('hidden');
        
        if (!reviewsStack) {
            reviewsStack = new ReviewsStack(document.getElementById('reviewsRoot'), {
                data: defaultReviewsData
            });
        }
    };
    
    window.closeReviewsModal = function() {
        document.getElementById('reviewsModal').classList.add('hidden');
    };
</script>
```

## 🔧 Настройка данных

### Использование собственных отзывов

Замените `defaultReviewsData` на ваши данные:

```javascript
const myReviews = [
    {
        id: 1,
        author: "Анна Петрова",
        rating: 5,
        text: "Отличный салон! Мастер Светлана сделала мне идеальную стрижку и окрашивание.",
        dateISO: "2024-01-15T10:30:00Z"
    },
    // ... другие отзывы
];

const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
    data: myReviews
});
```

### Загрузка с сервера

```javascript
async function loadReviews() {
    try {
        const response = await fetch('/api/reviews');
        const reviews = await response.json();
        
        const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
            data: reviews
        });
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
        // Использовать дефолтные данные при ошибке
        const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
            data: defaultReviewsData
        });
    }
}

loadReviews();
```

## 🎨 Кастомизация внешнего вида

### Изменение размеров

```css
:root {
    --card-width: 400px;    /* Ширина карточки */
    --card-height: 250px;   /* Высота карточки */
    --card-radius: 25px;    /* Радиус скругления */
}
```

### Изменение цветов

```css
:root {
    --star-filled: #ec4899;     /* Цвет звезд */
    --card-bg: #ffffff;         /* Фон карточки */
    --card-border: #fce7f3;     /* Граница карточки */
    --text-primary: #1f2937;    /* Основной текст */
    --text-secondary: #6b7280;  /* Вторичный текст */
}
```

### Изменение анимаций

```css
:root {
    --anim-swipe: 350ms;    /* Длительность свайпа */
    --anim-snap: 450ms;     /* Длительность возврата */
    --tilt-max-deg: 10deg;  /* Максимальный поворот */
}
```

## ✅ Проверка установки

1. Откройте страницу в браузере
2. Найдите секцию с отзывами
3. Попробуйте свайпнуть карточку влево/вправо
4. Проверьте работу кнопок управления
5. Убедитесь, что работает на мобильных устройствах
6. Проверьте доступность с клавиатуры (Tab, стрелки, Enter)

## 🐛 Устранение проблем

### Компонент не отображается
- Проверьте, что файлы CSS и JS подключены
- Убедитесь, что элемент `#reviewsRoot` существует
- Проверьте консоль браузера на ошибки

### Анимации не работают плавно
- Убедитесь, что используется современный браузер
- Проверьте, что нет конфликтов с другими CSS-анимациями
- Убедитесь, что включено аппаратное ускорение

### Не работает на мобильных устройствах
- Проверьте viewport meta tag
- Убедитесь, что touch events не блокируются
- Проверьте, что нет конфликтов с другими touch-обработчиками

## 🎉 Готово!

Компонент успешно интегрирован в ваш сайт! Теперь у вас есть:

- ✅ Красивая колода отзывов с iOS-стилем
- ✅ Бесконечное пролистывание
- ✅ Поддержка touch, mouse и keyboard
- ✅ Адаптивность для всех устройств
- ✅ Полная доступность
- ✅ Высокая производительность (60fps)

Компонент готов к использованию и может быть легко настроен под ваши потребности!
