# Интеграция Reviews Stack с автоматическим пролистыванием

## 🚀 Быстрая установка с автопролистыванием

### 1. Добавьте в `<head>` вашей страницы:

```html
<link rel="stylesheet" href="components/reviews-stack/reviews-stack.css">
```

### 2. Добавьте HTML разметку:

```html
<!-- Секция отзывов с автопролистыванием -->
<section class="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
    <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Отзывы наших клиентов
        </h2>
        <p class="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Узнайте, что говорят о нас довольные клиенты. Каждый отзыв — это история успешного преображения.
        </p>
        
        <!-- Индикатор автопролистывания -->
        <div class="text-center mb-4">
            <span class="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                <span class="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                Автоматическое пролистывание активно
            </span>
        </div>
        
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
            <button class="btn-secondary" id="toggleAutoPlayBtn">
                <i class="fas fa-pause mr-2"></i>Остановить автопролистывание
            </button>
        </div>
    </div>
</section>
```

### 3. Добавьте JavaScript инициализацию:

```html
<script type="module">
    import { ReviewsStack, defaultReviewsData } from './components/reviews-stack/reviews-stack.js';
    
    // Инициализация компонента с автопролистыванием
    const reviewsRoot = document.getElementById('reviewsRoot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const toggleAutoPlayBtn = document.getElementById('toggleAutoPlayBtn');
    
    let autoPlayEnabled = true;
    
    if (reviewsRoot) {
        const stack = new ReviewsStack(reviewsRoot, {
            data: defaultReviewsData,
            loop: true,
            cardsInDom: 4,
            autoPlay: true,                    // Включить автопролистывание
            autoPlayInterval: 5000,            // Интервал 5 секунд
            autoPlayPauseOnHover: true,        // Пауза при наведении
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
        if (toggleAutoPlayBtn) {
            toggleAutoPlayBtn.addEventListener('click', () => {
                autoPlayEnabled = !autoPlayEnabled;
                
                if (autoPlayEnabled) {
                    stack.startAutoPlay();
                    toggleAutoPlayBtn.innerHTML = '<i class="fas fa-pause mr-2"></i>Остановить автопролистывание';
                } else {
                    stack.pauseAutoPlay();
                    toggleAutoPlayBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Запустить автопролистывание';
                }
            });
        }
        
        // Глобальная переменная для отладки
        window.reviewsStack = stack;
    }
</script>
```

### 4. Добавьте стили для кнопок:

```css
/* Стили для кнопок управления */
.btn-primary {
    @apply bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300;
}

.btn-secondary {
    @apply bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200;
}

/* Анимация пульсации для индикатора */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.5;
        transform: scale(1.2);
    }
}

.animate-pulse {
    animation: pulse 2s infinite;
}
```

## ⚙️ Настройки автопролистывания

### Основные параметры:

```javascript
const stack = new ReviewsStack(reviewsRoot, {
    autoPlay: true,                    // Включить/выключить автопролистывание
    autoPlayInterval: 5000,            // Интервал в миллисекундах (5 секунд)
    autoPlayPauseOnHover: true,        // Пауза при наведении мыши
    // ... другие параметры
});
```

### Программное управление:

```javascript
// Запустить автопролистывание
stack.startAutoPlay();

// Остановить автопролистывание
stack.pauseAutoPlay();

// Проверить статус
if (stack.autoPlayTimer) {
    console.log('Автопролистывание активно');
} else {
    console.log('Автопролистывание остановлено');
}
```

## 🎯 Особенности автопролистывания

### Автоматическая пауза в следующих случаях:
- ✅ При наведении мыши на компонент
- ✅ При взаимодействии пользователя (свайп, клик, клавиатура)
- ✅ При скрытии вкладки браузера
- ✅ При переключении на другую вкладку

### Автоматическое возобновление:
- ✅ Через 2 секунды после взаимодействия пользователя
- ✅ При возврате на вкладку
- ✅ При убирании мыши с компонента

## 📱 Адаптивность

Компонент автоматически адаптируется под разные устройства:

```css
/* Мобильные устройства - более быстрые анимации */
@media (max-width: 480px) {
    :root {
        --anim-swipe: 350ms;
        --anim-snap: 450ms;
        --anim-stack: 250ms;
    }
}

/* Слабые устройства - упрощенные анимации */
@media (max-width: 320px) {
    :root {
        --anim-swipe: 300ms;
        --anim-snap: 400ms;
        --anim-stack: 200ms;
        --tilt-max-deg: 4deg;
    }
}
```

## 🎨 Кастомизация внешнего вида

### Изменение интервала автопролистывания:

```javascript
// Быстрое пролистывание (3 секунды)
autoPlayInterval: 3000

// Медленное пролистывание (8 секунд)
autoPlayInterval: 8000
```

### Отключение паузы при наведении:

```javascript
autoPlayPauseOnHover: false
```

### Полное отключение автопролистывания:

```javascript
autoPlay: false
```

## 🔧 Интеграция с существующими отзывами

### Если у вас уже есть отзывы в HTML:

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
    data: existingData,
    autoPlay: true,
    autoPlayInterval: 5000
});
```

### Загрузка с сервера:

```javascript
async function loadReviews() {
    try {
        const response = await fetch('/api/reviews');
        const reviews = await response.json();
        
        const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
            data: reviews,
            autoPlay: true,
            autoPlayInterval: 5000
        });
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
        // Использовать дефолтные данные при ошибке
        const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
            data: defaultReviewsData,
            autoPlay: true,
            autoPlayInterval: 5000
        });
    }
}

loadReviews();
```

## ✅ Проверка работы

1. **Автоматическое пролистывание:**
   - Отзывы должны сменяться каждые 5 секунд
   - Анимации должны быть плавными без подергиваний

2. **Пауза при взаимодействии:**
   - Наведите мышь на компонент - автопролистывание должно остановиться
   - Уберите мышь - автопролистывание должно возобновиться

3. **Ручное управление:**
   - Кнопки "Назад" и "Вперед" должны работать
   - Кнопка "Остановить/Запустить автопролистывание" должна переключать режим

4. **Мобильные устройства:**
   - Свайпы должны работать плавно
   - Автопролистывание должно паузироваться при свайпе

## 🎉 Результат

Теперь у вас есть:
- ✅ Автоматическое пролистывание отзывов каждые 5 секунд
- ✅ Плавные анимации без подергиваний (60fps)
- ✅ Умная пауза при взаимодействии пользователя
- ✅ Адаптивность для всех устройств
- ✅ Полная доступность и поддержка клавиатуры
- ✅ iOS-стиль с красивыми тенями и анимациями

Компонент готов к использованию и будет автоматически показывать отзывы вашим посетителям!
