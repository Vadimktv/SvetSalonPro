# Быстрая интеграция Reviews Stack в существующий сайт

## Шаг 1: Подключение файлов

Добавьте в `<head>` вашей страницы:

```html
<link rel="stylesheet" href="components/reviews-stack/reviews-stack.css">
<script type="module" src="components/reviews-stack/reviews-stack.js"></script>
```

## Шаг 2: HTML разметка

Добавьте в нужное место страницы:

```html
<div class="reviews" id="reviewsRoot"></div>
```

## Шаг 3: Инициализация

Добавьте в конец страницы перед `</body>`:

```html
<script type="module">
    import { ReviewsStack, defaultReviewsData } from './components/reviews-stack/reviews-stack.js';
    
    const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
        data: defaultReviewsData,
        loop: true,
        cardsInDom: 4
    });
</script>
```

## Шаг 4: Адаптация под дизайн (опционально)

Переопределите CSS-переменные в вашем стиле:

```css
:root {
    --card-width: 380px;                    /* Под вашу сетку */
    --card-height: 220px;                   /* Под ваш контент */
    --card-radius: 20px;                    /* Под ваш дизайн */
    --star-filled: #ec4899;                 /* Ваш основной цвет */
    --card-shadow-1: 0 4px 20px rgba(236, 72, 153, 0.1);
    --card-shadow-2: 0 2px 10px rgba(236, 72, 153, 0.05);
}
```

## Шаг 5: Добавление кнопок управления (опционально)

```html
<button onclick="stack.next()">Вперед →</button>
<button onclick="stack.prev()">← Назад</button>
```

## Пример полной интеграции

```html
<!DOCTYPE html>
<html>
<head>
    <title>Ваш сайт</title>
    <link rel="stylesheet" href="components/reviews-stack/reviews-stack.css">
    <style>
        /* Ваши стили */
        :root {
            --card-width: 380px;
            --star-filled: #ec4899;
        }
    </style>
</head>
<body>
    <!-- Ваш контент -->
    
    <!-- Секция отзывов -->
    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-8">Отзывы клиентов</h2>
            <div class="reviews" id="reviewsRoot"></div>
        </div>
    </section>
    
    <!-- Ваш контент -->
    
    <script type="module">
        import { ReviewsStack, defaultReviewsData } from './components/reviews-stack/reviews-stack.js';
        
        const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
            data: defaultReviewsData,
            loop: true,
            cardsInDom: 4,
            onChange: (index, review) => {
                console.log('Показан отзыв:', review.author);
            }
        });
    </script>
</body>
</html>
```

## Использование собственных данных

```javascript
const myReviews = [
    {
        id: 1,
        author: "Иван Петров",
        rating: 5,
        text: "Отличный сервис!",
        dateISO: "2024-01-15T10:30:00Z"
    }
    // ... другие отзывы
];

const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
    data: myReviews
});
```

## Загрузка с сервера

```javascript
async function loadReviews() {
    const response = await fetch('/api/reviews');
    const reviews = await response.json();
    
    const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
        data: reviews
    });
}

loadReviews();
```

## Готово! 🎉

Компонент автоматически:
- ✅ Адаптируется под мобильные устройства
- ✅ Поддерживает touch, mouse и keyboard
- ✅ Работает с 60fps анимациями
- ✅ Полностью доступен для screen readers
- ✅ Поддерживает prefers-reduced-motion

## Полезные методы

```javascript
stack.next();                    // Следующий отзыв
stack.prev();                    // Предыдущий отзыв
stack.updateData(newReviews);    // Обновить данные
stack.destroy();                 // Уничтожить компонент
```
