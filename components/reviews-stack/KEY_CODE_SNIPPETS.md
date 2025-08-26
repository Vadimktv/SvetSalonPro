# Ключевые фрагменты кода Reviews Stack Component

## 1. Инициализация компонента

```javascript
import { ReviewsStack, defaultReviewsData } from './reviews-stack.js';

const stack = new ReviewsStack(document.getElementById('reviewsRoot'), {
    data: defaultReviewsData,
    loop: true,
    cardsInDom: 4,
    onChange: (index, review) => {
        console.log('Текущий отзыв:', review);
    }
});
```

## 2. Обработка свайпов (основная логика)

```javascript
handlePointerStart(e) {
    if (this.isDragging) return;
    
    e.preventDefault();
    this.isDragging = true;
    
    const point = this.getPointerPosition(e);
    this.dragStart = { x: point.x, y: point.y };
    this.dragCurrent = { x: point.x, y: point.y };
    this.velocity = { x: 0, y: 0 };
    this.lastMoveTime = Date.now();
    
    const topCard = this.cards[0];
    if (topCard) {
        topCard.classList.add('dragging');
        topCard.setPointerCapture?.(e.pointerId);
    }
    
    this.animationFrame = requestAnimationFrame(this.updateDrag.bind(this));
}
```

## 3. GPU-ускоренная анимация перетаскивания

```javascript
updateDrag() {
    if (!this.isDragging) return;
    
    const dx = this.dragCurrent.x - this.dragStart.x;
    const dy = this.dragCurrent.y - this.dragStart.y;
    
    const topCard = this.cards[0];
    if (topCard) {
        const cardWidth = this.root.offsetWidth;
        
        // Расчет поворота на основе горизонтального движения
        const tiltMax = this.reducedMotion ? 2 : 8;
        const rotation = Math.max(-tiltMax, Math.min(tiltMax, (dx / cardWidth) * tiltMax));
        
        // Применение transform3d для GPU-ускорения
        const transform = `translate3d(${dx}px, ${dy}px, 0) rotateZ(${rotation}deg)`;
        topCard.style.transform = transform;
        
        // Обновление стопки карт с плавной анимацией
        this.updateStackCards(dx);
    }
    
    this.animationFrame = requestAnimationFrame(this.updateDrag.bind(this));
}
```

## 4. Принятие решения о свайпе

```javascript
handleSwipeDecision() {
    const dx = this.dragCurrent.x - this.dragStart.x;
    const cardWidth = this.root.offsetWidth;
    const threshold = cardWidth * 0.25; // 25% ширины карты
    const velocityThreshold = 0.5; // пикселей в миллисекунду
    
    const shouldSwipe = Math.abs(dx) > threshold || Math.abs(this.velocity.x) > velocityThreshold;
    
    if (shouldSwipe) {
        this.swipeCard(dx > 0 ? 1 : -1);
    } else {
        this.snapBack();
    }
}
```

## 5. Анимация свайпа карты

```javascript
swipeCard(direction) {
    const topCard = this.cards[0];
    if (!topCard) return;
    
    topCard.classList.add('swiping');
    
    const cardWidth = this.root.offsetWidth;
    const translateX = direction * cardWidth * 1.5;
    const translateY = this.dragCurrent.y - this.dragStart.y;
    
    // Плавное исчезновение с поворотом
    topCard.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateZ(${direction * 15}deg)`;
    topCard.style.opacity = '0';
    
    setTimeout(() => {
        this.moveCardToEnd();
        this.render();
        this.updateAccessibility();
        
        if (this.options.onChange) {
            this.options.onChange(this.currentIndex, this.data[this.currentIndex]);
        }
    }, this.reducedMotion ? 150 : 300);
}
```

## 6. Пружинный возврат карты

```javascript
snapBack() {
    const topCard = this.cards[0];
    if (!topCard) return;
    
    topCard.classList.add('snapping');
    topCard.style.transform = 'translate3d(0, 0, 0) rotateZ(0deg)';
    topCard.style.opacity = '1';
    
    // Сброс позиций карт в стопке
    for (let i = 1; i < this.cards.length; i++) {
        const card = this.cards[i];
        if (card) {
            card.style.transform = '';
        }
    }
    
    setTimeout(() => {
        topCard.classList.remove('snapping');
    }, this.reducedMotion ? 200 : 400);
}
```

## 7. Виртуализация DOM (только 4 карты)

```javascript
render() {
    this.stack.innerHTML = '';
    this.cards = [];
    
    const cardsToRender = Math.min(this.options.cardsInDom, this.data.length);
    
    for (let i = 0; i < cardsToRender; i++) {
        const review = this.data[i];
        const card = this.createCard(review, i);
        this.stack.appendChild(card);
        this.cards.push(card);
    }
}
```

## 8. Создание карточки с доступностью

```javascript
createCard(review, index) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.setAttribute('data-index', index);
    card.setAttribute('role', 'article');
    card.setAttribute('aria-roledescription', 'review card');
    card.setAttribute('tabindex', index === 0 ? '0' : '-1');
    card.setAttribute('aria-label', `Отзыв от ${review.author}, рейтинг ${review.rating} из 5`);
    
    const stars = this.createStars(review.rating);
    const date = new Date(review.dateISO).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <div class="review-header">
            <h3 class="review-author">${this.escapeHtml(review.author)}</h3>
            <time class="review-date" datetime="${review.dateISO}">${date}</time>
        </div>
        <div class="review-rating" aria-label="Рейтинг: ${review.rating} из 5 звезд">
            ${stars}
        </div>
        <p class="review-text">${this.escapeHtml(review.text)}</p>
    `;
    
    return card;
}
```

## 9. Поддержка клавиатуры

```javascript
handleKeydown(e) {
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            this.prev();
            break;
        case 'ArrowRight':
            e.preventDefault();
            this.next();
            break;
        case 'Enter':
        case ' ':
            e.preventDefault();
            this.announceCurrentReview();
            break;
    }
}
```

## 10. CSS для GPU-ускорения

```css
.review-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: var(--card-radius);
    box-shadow: var(--card-shadow-1), var(--card-shadow-2);
    padding: 20px;
    box-sizing: border-box;
    cursor: grab;
    will-change: transform, opacity;  /* Подготовка к анимации */
    transform: translate3d(0, 0, 0);  /* GPU-ускорение */
    transition: box-shadow var(--anim-stack) ease-out;
    
    /* Предотвращение выделения текста при перетаскивании */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.review-card.dragging {
    transition: none;  /* Отключение transition во время drag */
    box-shadow: var(--card-shadow-active);
    z-index: 1000;
}

.review-card.swiping {
    transition: transform var(--anim-swipe) cubic-bezier(0.2, 0.8, 0.2, 1);
}

.review-card.snapping {
    transition: transform var(--anim-snap) cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

## 11. Поддержка prefers-reduced-motion

```css
/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    :root {
        --anim-swipe: 150ms;
        --anim-snap: 200ms;
        --anim-stack: 100ms;
        --tilt-max-deg: 2deg;
    }
}
```

## 12. Адаптивность для мобильных устройств

```css
/* Mobile optimizations */
@media (max-width: 480px) {
    :root {
        --card-width: 280px;
        --card-height: 180px;
        --card-radius: 14px;
    }
    
    .review-card {
        padding: 16px;
    }
    
    .review-author {
        font-size: 15px;
    }
    
    .review-text {
        font-size: 13px;
        -webkit-line-clamp: 3;
    }
}

/* High performance mode for weak devices */
@media (max-width: 320px) {
    :root {
        --tilt-max-deg: 4deg;
        --stack-scale-step: 0.02;
    }
}
```

## 13. Бесконечное циклическое пролистывание

```javascript
moveCardToEnd() {
    if (this.data.length < 2) return;
    
    const firstReview = this.data.shift();
    this.data.push(firstReview);
}

next() {
    if (this.data.length < 2) return;
    
    this.moveCardToEnd();
    this.render();
    this.updateAccessibility();
    
    if (this.options.onChange) {
        this.options.onChange(this.currentIndex, this.data[this.currentIndex]);
    }
}

prev() {
    if (this.data.length < 2) return;
    
    const lastReview = this.data.pop();
    this.data.unshift(lastReview);
    this.render();
    this.updateAccessibility();
    
    if (this.options.onChange) {
        this.options.onChange(this.currentIndex, this.data[this.currentIndex]);
    }
}
```

## 14. Обновление данных на лету

```javascript
updateData(newData) {
    this.data = [...newData];
    this.currentIndex = 0;
    this.render();
    this.updateAccessibility();
}
```

## 15. Очистка ресурсов

```javascript
destroy() {
    if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
    }
    
    // Удаление обработчиков событий
    this.stack.removeEventListener('touchstart', this.handlePointerStart);
    this.stack.removeEventListener('touchmove', this.handlePointerMove);
    this.stack.removeEventListener('touchend', this.handlePointerEnd);
    this.stack.removeEventListener('mousedown', this.handlePointerStart);
    this.stack.removeEventListener('mousemove', this.handlePointerMove);
    this.stack.removeEventListener('mouseup', this.handlePointerEnd);
    this.stack.removeEventListener('mouseleave', this.handlePointerEnd);
    this.stack.removeEventListener('keydown', this.handleKeydown);
    
    this.root.innerHTML = '';
}
```

Эти фрагменты демонстрируют ключевые аспекты реализации:
- ✅ Обработка touch/mouse событий
- ✅ GPU-ускоренные анимации
- ✅ Виртуализация DOM
- ✅ Доступность (ARIA, keyboard)
- ✅ Производительность (requestAnimationFrame)
- ✅ Адаптивность (media queries)
- ✅ Бесконечное пролистывание
- ✅ Пружинные анимации
