# Reviews Stack Component

Компонент колоды отзывов с бесконечным пролистыванием и сверхплавной анимацией в стиле iOS.

## Возможности

- ✅ Бесконечное циклическое пролистывание
- ✅ Поддержка touch, mouse и keyboard
- ✅ GPU-ускоренные анимации (60fps)
- ✅ Адаптивный дизайн (мобильный первым)
- ✅ Поддержка `prefers-reduced-motion`
- ✅ Полная доступность (ARIA, screen readers)
- ✅ iOS-стиль с плавными тенями
- ✅ Пружинные анимации возврата
- ✅ Виртуализация DOM (только 4 карты в памяти)
- ✅ Автоопределение производительности устройства

## Быстрый старт

### 1. Подключение файлов

```html
<link rel="stylesheet" href="components/reviews-stack/reviews-stack.css">
<script type="module" src="components/reviews-stack/reviews-stack.js"></script>
```

### 2. HTML разметка

```html
<div class="reviews" id="reviewsRoot"></div>
```

### 3. Инициализация

```javascript
import { ReviewsStack, defaultReviewsData } from './components/reviews-stack/reviews-stack.js';

const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
    data: defaultReviewsData,
    loop: true,
    cardsInDom: 4,
    onChange: (index, review) => {
        console.log('Текущий отзыв:', review);
    }
});
```

## API

### Конструктор

```javascript
new ReviewsStack(rootEl, options)
```

**Параметры:**
- `rootEl` (HTMLElement) - корневой элемент для компонента
- `options` (Object) - настройки компонента

**Опции:**
- `data` (Array) - массив отзывов (по умолчанию: `[]`)
- `loop` (Boolean) - бесконечное пролистывание (по умолчанию: `true`)
- `cardsInDom` (Number) - количество карт в DOM (по умолчанию: `4`)
- `onChange` (Function) - callback при смене отзыва

### Методы

#### `next()`
Программно перелистнуть вперед.

```javascript
stack.next();
```

#### `prev()`
Программно перелистнуть назад.

```javascript
stack.prev();
```

#### `updateData(newData)`
Заменить набор отзывов на лету.

```javascript
stack.updateData([
    { id: 1, author: "Иван", rating: 5, text: "Отличный сервис!", dateISO: "2024-01-15T10:30:00Z" }
]);
```

#### `destroy()`
Уничтожить компонент и очистить ресурсы.

```javascript
stack.destroy();
```

## Структура данных отзыва

```javascript
{
    id: 1,                    // Уникальный идентификатор
    author: "Анна Петрова",   // Имя автора
    rating: 5,               // Рейтинг (1-5)
    text: "Текст отзыва...", // Текст отзыва
    dateISO: "2024-01-15T10:30:00Z" // Дата в ISO формате
}
```

## CSS Переменные

Компонент полностью настраивается через CSS-переменные:

### Размеры карточек
```css
--card-width: 320px;        /* Ширина карточки */
--card-height: 200px;       /* Высота карточки */
--card-radius: 16px;        /* Радиус скругления */
```

### Тени
```css
--card-shadow-1: 0 2px 8px rgba(0, 0, 0, 0.08);    /* Основная тень */
--card-shadow-2: 0 1px 3px rgba(0, 0, 0, 0.12);    /* Дополнительная тень */
--card-shadow-active: 0 4px 16px rgba(0, 0, 0, 0.12); /* Активная тень */
```

### Анимации
```css
--anim-swipe: 300ms;        /* Длительность свайпа */
--anim-snap: 400ms;         /* Длительность возврата */
--anim-stack: 200ms;        /* Длительность анимации стопки */
```

### Эффекты стопки
```css
--tilt-max-deg: 8deg;       /* Максимальный поворот при свайпе */
--stack-gap: 8px;           /* Расстояние между картами в стопке */
--stack-scale-step: 0.03;   /* Шаг масштабирования для стопки */
--stack-translate-step: 4px; /* Шаг смещения для стопки */
```

### Цвета
```css
--card-bg: #ffffff;         /* Фон карточки */
--card-border: #f0f0f0;     /* Граница карточки */
--text-primary: #1d1d1f;    /* Основной текст */
--text-secondary: #86868b;  /* Вторичный текст */
--star-filled: #ff9500;     /* Заполненная звезда */
--star-empty: #d2d2d7;      /* Пустая звезда */
```

## Управление

### Touch/Mouse
- **Свайп влево/вправо** - перелистнуть карточку
- **Drag & Drop** - интерактивное перетаскивание

### Keyboard
- **←/→** - навигация между отзывами
- **Enter/Space** - прочитать текущий отзыв

### Программное
```javascript
stack.next();    // Следующий отзыв
stack.prev();    // Предыдущий отзыв
```

## Доступность

Компонент полностью соответствует стандартам доступности:

- **ARIA-атрибуты** для screen readers
- **Клавиатурная навигация** (Tab, стрелки, Enter)
- **Живая область** для объявления изменений
- **Поддержка `prefers-reduced-motion`**
- **Семантическая разметка** (article, time, h3)

## Производительность

### Оптимизации
- **GPU-ускорение** через `transform3d` и `will-change`
- **Виртуализация DOM** - только 4 карты в памяти
- **RequestAnimationFrame** для плавных анимаций
- **Автоопределение производительности** устройства
- **Минимизация reflow** - только transform/opacity

### Мониторинг
```javascript
// Проверка производительности в DevTools
// Performance tab -> Record -> Свайпайте карточки
// Должно быть стабильно 60fps
```

## Интеграция с существующим сайтом

### Если уже есть отзывы в HTML

```javascript
// Парсинг существующих отзывов
function parseExistingReviews() {
    const reviewElements = document.querySelectorAll('.existing-review');
    return Array.from(reviewElements).map(el => ({
        id: el.dataset.id,
        author: el.querySelector('.author').textContent,
        rating: parseInt(el.querySelector('.rating').dataset.value),
        text: el.querySelector('.text').textContent,
        dateISO: el.querySelector('time').datetime
    }));
}

const existingData = parseExistingReviews();
const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
    data: existingData
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
    }
}
```

## Примеры использования

### Базовый пример
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="reviews-stack.css">
</head>
<body>
    <div class="reviews" id="reviewsRoot"></div>
    
    <script type="module">
        import { ReviewsStack, defaultReviewsData } from './reviews-stack.js';
        
        const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
            data: defaultReviewsData
        });
    </script>
</body>
</html>
```

### С кастомными настройками
```javascript
const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
    data: myReviews,
    loop: true,
    cardsInDom: 5,
    onChange: (index, review) => {
        // Обновить счетчик
        document.getElementById('counter').textContent = `${index + 1} из ${myReviews.length}`;
        
        // Отправить аналитику
        analytics.track('review_viewed', { reviewId: review.id });
    }
});
```

### С кнопками управления
```html
<button onclick="stack.prev()">← Назад</button>
<button onclick="stack.next()">Вперед →</button>
<button onclick="stack.updateData(shuffledReviews)">Перемешать</button>
```

## Совместимость

- **Браузеры**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Мобильные**: iOS Safari 12+, Chrome Mobile 60+
- **Требования**: ES6 modules, CSS Grid, Flexbox

## Лицензия

MIT License - свободное использование в коммерческих и некоммерческих проектах.

## Поддержка

При возникновении проблем:
1. Проверьте консоль браузера на ошибки
2. Убедитесь, что все файлы подключены
3. Проверьте структуру данных отзывов
4. Откройте issue в репозитории проекта
