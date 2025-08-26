/**
 * ReviewsStack - Компонент колоды отзывов с бесконечным пролистыванием
 * Поддерживает touch, mouse, keyboard с GPU-ускоренными анимациями
 */
export class ReviewsStack {
  constructor(rootEl, options = {}) {
    this.root = rootEl;
    this.options = {
      data: [],
      loop: true,
      cardsInDom: 4,
      onChange: null,
      autoPlay: true,           // Автоматическое пролистывание
      autoPlayInterval: 5000,   // Интервал в миллисекундах
      autoPlayPauseOnHover: true, // Пауза при наведении
      ...options
    };
    
    this.data = [...this.options.data];
    this.currentIndex = 0;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.dragCurrent = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.lastMoveTime = 0;
    this.animationFrame = null;
    
    // DOM elements
    this.stack = null;
    this.cards = [];
    
    // Performance settings
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isLowPerformance = this.detectLowPerformance();
    
    // Auto-play settings
    this.autoPlayTimer = null;
    this.isHovered = false;
    this.isTransitioning = false;
    
    this.init();
  }
  
  init() {
    if (!this.root) {
      console.error('ReviewsStack: root element is required');
      return;
    }
    
    if (this.data.length < 3) {
      console.warn('ReviewsStack: at least 3 reviews required for smooth operation');
    }
    
    this.createDOM();
    this.bindEvents();
    this.render();
    this.updateAccessibility();
    
    // Запуск автоматического пролистывания
    if (this.options.autoPlay && this.data.length > 1) {
      this.startAutoPlay();
    }
  }
  
  createDOM() {
    this.root.innerHTML = `
      <div class="reviews-stack" id="reviewsStack" role="group" aria-label="Колода отзывов">
      </div>
      <div aria-live="polite" class="sr-only"></div>
    `;
    
    this.stack = this.root.querySelector('.reviews-stack');
    this.liveRegion = this.root.querySelector('[aria-live]');
  }
  
  bindEvents() {
    // Touch events
    this.stack.addEventListener('touchstart', this.handlePointerStart.bind(this), { passive: false });
    this.stack.addEventListener('touchmove', this.handlePointerMove.bind(this), { passive: false });
    this.stack.addEventListener('touchend', this.handlePointerEnd.bind(this), { passive: false });
    
    // Mouse events
    this.stack.addEventListener('mousedown', this.handlePointerStart.bind(this));
    this.stack.addEventListener('mousemove', this.handlePointerMove.bind(this));
    this.stack.addEventListener('mouseup', this.handlePointerEnd.bind(this));
    this.stack.addEventListener('mouseleave', this.handlePointerEnd.bind(this));
    
    // Keyboard events
    this.stack.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Hover events for auto-play pause
    if (this.options.autoPlayPauseOnHover) {
      this.root.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      this.root.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }
    
    // Prevent context menu on long press
    this.stack.addEventListener('contextmenu', e => e.preventDefault());
    
    // Reduced motion changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
    });
    
    // Visibility change events for auto-play
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }
  
  handlePointerStart(e) {
    if (this.isDragging || this.isTransitioning) return;
    
    e.preventDefault();
    this.isDragging = true;
    
    // Пауза автопролистывания при взаимодействии
    this.pauseAutoPlay();
    
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
  
  handlePointerMove(e) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    
    const point = this.getPointerPosition(e);
    const now = Date.now();
    const deltaTime = now - this.lastMoveTime;
    
    if (deltaTime > 0) {
      this.velocity.x = (point.x - this.dragCurrent.x) / deltaTime;
      this.velocity.y = (point.y - this.dragCurrent.y) / deltaTime;
    }
    
    this.dragCurrent = { x: point.x, y: point.y };
    this.lastMoveTime = now;
  }
  
  handlePointerEnd(e) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    this.isDragging = false;
    
    const topCard = this.cards[0];
    if (topCard) {
      topCard.classList.remove('dragging');
      topCard.releasePointerCapture?.(e.pointerId);
    }
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    this.handleSwipeDecision();
    
    // Возобновление автопролистывания через небольшую задержку
    setTimeout(() => {
      if (this.options.autoPlay && !this.isHovered) {
        this.startAutoPlay();
      }
    }, 2000);
  }
  
  handleKeydown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.pauseAutoPlay();
        this.prev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.pauseAutoPlay();
        this.next();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.announceCurrentReview();
        break;
    }
  }
  
  handleMouseEnter() {
    this.isHovered = true;
    this.pauseAutoPlay();
  }
  
  handleMouseLeave() {
    this.isHovered = false;
    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
  }
  
  handleVisibilityChange() {
    if (document.hidden) {
      this.pauseAutoPlay();
    } else if (this.options.autoPlay && !this.isHovered) {
      this.startAutoPlay();
    }
  }
  
  getPointerPosition(e) {
    const rect = this.stack.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
  
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
  
  updateStackCards(dx) {
    const intensity = Math.min(Math.abs(dx) / this.root.offsetWidth, 1);
    const easeIntensity = this.easeOutCubic(intensity);
    
    for (let i = 1; i < this.cards.length; i++) {
      const card = this.cards[i];
      if (!card) continue;
      
      const baseScale = 1 - (i * 0.03);
      const baseTranslateY = i * 8;
      
      const scale = baseScale + (easeIntensity * 0.02);
      const translateY = baseTranslateY - (easeIntensity * 1.5);
      
      card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
    }
  }
  
  handleSwipeDecision() {
    const dx = this.dragCurrent.x - this.dragStart.x;
    const cardWidth = this.root.offsetWidth;
    const threshold = cardWidth * 0.25;
    const velocityThreshold = 0.5; // пикселей в миллисекунду
    
    const shouldSwipe = Math.abs(dx) > threshold || Math.abs(this.velocity.x) > velocityThreshold;
    
    if (shouldSwipe) {
      this.swipeCard(dx > 0 ? 1 : -1);
    } else {
      this.snapBack();
    }
  }
  
  swipeCard(direction) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
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
      this.isTransitioning = false;
      
      if (this.options.onChange) {
        this.options.onChange(this.currentIndex, this.data[this.currentIndex]);
      }
    }, this.reducedMotion ? 150 : 300);
  }
  
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
  
  moveCardToEnd() {
    if (this.data.length < 2) return;
    
    const firstReview = this.data.shift();
    this.data.push(firstReview);
  }
  
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
  
  createStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      stars += `<span class="star ${isFilled ? 'filled' : ''}" aria-hidden="true"></span>`;
    }
    return stars;
  }
  
  updateAccessibility() {
    const currentReview = this.data[0];
    if (currentReview) {
      const message = `Показан отзыв от ${currentReview.author}, рейтинг ${currentReview.rating} из 5`;
      this.liveRegion.textContent = message;
    }
  }
  
  announceCurrentReview() {
    const currentReview = this.data[0];
    if (currentReview) {
      const message = `Отзыв от ${currentReview.author}. ${currentReview.text}`;
      this.liveRegion.textContent = message;
    }
  }
  
  // Автоматическое пролистывание
  startAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
    
    if (this.options.autoPlay && this.data.length > 1 && !this.isHovered && !document.hidden) {
      this.autoPlayTimer = setInterval(() => {
        if (!this.isDragging && !this.isTransitioning) {
          this.next();
        }
      }, this.options.autoPlayInterval);
    }
  }
  
  pauseAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }
  
  next() {
    if (this.data.length < 2 || this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.moveCardToEnd();
    this.render();
    this.updateAccessibility();
    
    // Плавная анимация смены
    setTimeout(() => {
      this.isTransitioning = false;
    }, 100);
    
    if (this.options.onChange) {
      this.options.onChange(this.currentIndex, this.data[this.currentIndex]);
    }
  }
  
  prev() {
    if (this.data.length < 2 || this.isTransitioning) return;
    
    this.isTransitioning = true;
    const lastReview = this.data.pop();
    this.data.unshift(lastReview);
    this.render();
    this.updateAccessibility();
    
    // Плавная анимация смены
    setTimeout(() => {
      this.isTransitioning = false;
    }, 100);
    
    if (this.options.onChange) {
      this.options.onChange(this.currentIndex, this.data[this.currentIndex]);
    }
  }
  
  updateData(newData) {
    this.data = [...newData];
    this.currentIndex = 0;
    this.render();
    this.updateAccessibility();
  }
  
  // Utility methods
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  detectLowPerformance() {
    // Simple heuristic for low performance devices
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    
    return isSlowConnection || navigator.hardwareConcurrency <= 2;
  }
  
  destroy() {
    this.pauseAutoPlay();
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    // Remove event listeners
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
}

// Default mock data
export const defaultReviewsData = [
  {
    id: 1,
    author: "Анна Петрова",
    rating: 5,
    text: "Отличный салон! Мастер Светлана сделала мне идеальную стрижку и окрашивание. Очень довольна результатом, буду рекомендовать всем подругам.",
    dateISO: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    author: "Мария Сидорова",
    rating: 5,
    text: "Прекрасный маникюр! Девушки работают аккуратно и профессионально. Цвет держится долго, очень довольна качеством услуг.",
    dateISO: "2024-01-14T14:20:00Z"
  },
  {
    id: 3,
    author: "Елена Козлова",
    rating: 4,
    text: "Хороший салон, приятная атмосфера. Мастер внимательно выслушала мои пожелания и выполнила работу качественно. Рекомендую!",
    dateISO: "2024-01-13T16:45:00Z"
  },
  {
    id: 4,
    author: "Ольга Новикова",
    rating: 5,
    text: "Впервые была в этом салоне, осталась в восторге! Профессиональный подход, современное оборудование, отличный результат.",
    dateISO: "2024-01-12T11:15:00Z"
  },
  {
    id: 5,
    author: "Татьяна Морозова",
    rating: 5,
    text: "Лучший салон в городе! Делаю здесь все процедуры уже больше года. Мастера настоящие профессионалы, всегда довольна результатом.",
    dateISO: "2024-01-11T13:30:00Z"
  },
  {
    id: 6,
    author: "Ирина Волкова",
    rating: 4,
    text: "Приятная атмосфера, вежливый персонал. Сделали мне красивый маникюр, цвет подобрали идеально. Обязательно приду еще!",
    dateISO: "2024-01-10T15:20:00Z"
  },
  {
    id: 7,
    author: "Наталья Соколова",
    rating: 5,
    text: "Отличный сервис! Мастер Анна сделала мне потрясающую прическу на выпускной. Все гости были в восторге, спасибо большое!",
    dateISO: "2024-01-09T12:00:00Z"
  },
  {
    id: 8,
    author: "Юлия Лебедева",
    rating: 5,
    text: "Профессиональный подход к каждому клиенту. Делаю здесь стрижки и окрашивание уже полгода, всегда довольна результатом.",
    dateISO: "2024-01-08T17:30:00Z"
  }
];
