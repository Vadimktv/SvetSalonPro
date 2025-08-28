# Исправление центрирования отзывов клиентов

## Проблема:
Отзывы клиентов отображались некорректно на мобильных устройствах - они уходили влево и не были видны по центру экрана.

## Внесенные исправления:

### 1. HTML структура:
- Добавлены классы `flex justify-center items-center` к контейнеру отзывов
- Добавлены классы `flex justify-center items-center` к swiper-wrapper
- Изменен контейнер секции на `flex flex-col items-center`

### 2. CSS стили для мобильных устройств:

#### Контейнер отзывов:
```css
@media (max-width: 768px) {
    .reviews-deck-container {
        padding: 20px 0;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
    }
    
    .container {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
    }
}
```

#### Swiper контейнер:
```css
@media (max-width: 768px) {
    .reviews-swiper {
        height: auto !important;
        min-height: 400px !important;
        overflow: hidden !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
    }
    
    .swiper-wrapper {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
    }
    
    .swiper-slide {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        width: 100% !important;
    }
}
```

#### Карточки отзывов:
```css
@media (max-width: 768px) {
    .review-card {
        padding: 1.5rem !important;
        height: auto !important;
        min-height: 280px !important;
        max-width: 90% !important;
        width: 90% !important;
        margin: 0 auto !important;
    }
}

@media (max-width: 480px) {
    .review-card {
        max-width: 95% !important;
        width: 95% !important;
        padding: 1rem !important;
        min-height: 250px !important;
    }
    
    .reviews-deck-container {
        padding: 10px 0 !important;
    }
}
```

### 3. Дополнительные улучшения:
- Добавлены стили для очень маленьких экранов (до 480px)
- Улучшено центрирование всех элементов
- Оптимизированы отступы для разных размеров экранов

## Результат:
- ✅ Отзывы теперь корректно центрируются на мобильных устройствах
- ✅ Карточки отзывов видны по центру экрана
- ✅ Улучшена адаптивность для разных размеров экранов
- ✅ Сохранены все анимации и эффекты

## Тестирование:
Сайт можно протестировать на мобильном устройстве или в режиме разработчика браузера, установив ширину экрана менее 768px. Отзывы должны отображаться по центру экрана.
