/**
 * Modern Reviews Component - Simple & Functional
 * Чистый и простой компонент отзывов без сложных анимаций
 */
export class ReviewsComponent {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      data: [],
      itemsPerPage: 6,
      showControls: true,
      showNavigation: true,
      autoPlay: false,
      autoPlayInterval: 5000,
      ...options
    };
    
    this.data = [...this.options.data];
    this.currentPage = 0;
    this.totalPages = Math.ceil(this.data.length / this.options.itemsPerPage);
    this.autoPlayTimer = null;
    
    this.init();
  }
  
  init() {
    if (!this.container) {
      console.error('ReviewsComponent: container is required');
      return;
    }
    
    this.render();
    this.bindEvents();
    
    if (this.options.autoPlay && this.data.length > this.options.itemsPerPage) {
      this.startAutoPlay();
    }
  }
  
  render() {
    this.container.innerHTML = `
      <div class="reviews-container">
        <div class="reviews-header">
          <h2 class="reviews-title">Отзывы наших клиентов</h2>
          <p class="reviews-subtitle">Что говорят о нас довольные клиенты</p>
        </div>
        
        ${this.options.showControls ? this.renderControls() : ''}
        
        <div class="reviews-grid" id="reviewsGrid">
          ${this.renderReviews()}
        </div>
        
        ${this.options.showNavigation ? this.renderNavigation() : ''}
        
        <div class="reviews-status" id="reviewsStatus">
          ${this.getStatusText()}
        </div>
      </div>
    `;
    
    this.grid = this.container.querySelector('#reviewsGrid');
    this.status = this.container.querySelector('#reviewsStatus');
  }
  
  renderControls() {
    return `
      <div class="reviews-controls">
        <button class="control-btn" id="prevBtn" ${this.currentPage === 0 ? 'disabled' : ''}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
          Назад
        </button>
        
        <button class="control-btn" id="nextBtn" ${this.currentPage >= this.totalPages - 1 ? 'disabled' : ''}>
          Вперед
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
        
        <button class="control-btn" id="shuffleBtn">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H6a.5.5 0 0 1 0-1h1.5V3.5A.5.5 0 0 1 8 3zm3.732 1.732a.5.5 0 0 1 .707 0l2.002 2.002a.5.5 0 0 1-.707.707L12.732 5.44a.5.5 0 0 1 0-.708z"/>
            <path d="M8 6a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.732 4.732a.5.5 0 0 1 .707 0L8 6.207l2.561-2.561a.5.5 0 0 1 .707.707L8.707 7l2.561 2.561a.5.5 0 0 1-.707.707L8 7.707l-2.561 2.561a.5.5 0 0 1-.707-.707L7.293 7 4.732 4.439a.5.5 0 0 1 0-.707z"/>
          </svg>
          Перемешать
        </button>
        
        <button class="control-btn" id="autoPlayBtn">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
          </svg>
          Автопролистывание
        </button>
      </div>
    `;
  }
  
  renderReviews() {
    const startIndex = this.currentPage * this.options.itemsPerPage;
    const endIndex = startIndex + this.options.itemsPerPage;
    const pageData = this.data.slice(startIndex, endIndex);
    
    return pageData.map((review, index) => {
      const variant = (startIndex + index) % 5 + 1;
      const avatarLetter = review.author.charAt(0).toUpperCase();
      
      return `
        <div class="review-card variant-${variant}" data-index="${startIndex + index}">
          <div class="review-header">
            <div class="review-avatar variant-${variant}">
              ${avatarLetter}
            </div>
            <div class="review-info">
              <h3 class="review-author">${review.author}</h3>
              <p class="review-location">${review.location || 'Клиент'}</p>
            </div>
          </div>
          
          <div class="review-rating">
            <div class="stars">
              ${this.generateStars(review.rating)}
            </div>
            <span class="rating-text">${review.rating}/5</span>
          </div>
          
          <p class="review-text">${review.text}</p>
          <p class="review-date">${review.date}</p>
        </div>
      `;
    }).join('');
  }
  
  renderNavigation() {
    if (this.totalPages <= 1) return '';
    
    const dots = [];
    for (let i = 0; i < this.totalPages; i++) {
      dots.push(`
        <div class="nav-dot ${i === this.currentPage ? 'active' : ''}" 
             data-page="${i}" 
             title="Страница ${i + 1}">
        </div>
      `);
    }
    
    return `<div class="reviews-nav">${dots.join('')}</div>`;
  }
  
  generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += `
        <svg class="star ${i <= rating ? 'filled' : ''}" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      `;
    }
    return stars;
  }
  
  getStatusText() {
    const start = this.currentPage * this.options.itemsPerPage + 1;
    const end = Math.min((this.currentPage + 1) * this.options.itemsPerPage, this.data.length);
    const total = this.data.length;
    
    return `Показано ${start}-${end} из ${total} отзывов`;
  }
  
  bindEvents() {
    // Кнопки управления
    const prevBtn = this.container.querySelector('#prevBtn');
    const nextBtn = this.container.querySelector('#nextBtn');
    const shuffleBtn = this.container.querySelector('#shuffleBtn');
    const autoPlayBtn = this.container.querySelector('#autoPlayBtn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prev());
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next());
    }
    
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => this.shuffle());
    }
    
    if (autoPlayBtn) {
      autoPlayBtn.addEventListener('click', () => this.toggleAutoPlay());
    }
    
    // Навигационные точки
    const navDots = this.container.querySelectorAll('.nav-dot');
    navDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const page = parseInt(dot.dataset.page);
        this.goToPage(page);
      });
    });
    
    // Клавиатурная навигация
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      }
    });
  }
  
  prev() {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }
  
  next() {
    if (this.currentPage < this.totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }
  
  goToPage(page) {
    if (page < 0 || page >= this.totalPages || page === this.currentPage) return;
    
    this.currentPage = page;
    this.render();
    this.bindEvents();
    this.updateStatus();
  }
  
  shuffle() {
    // Перемешиваем данные
    for (let i = this.data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
    }
    
    this.currentPage = 0;
    this.render();
    this.bindEvents();
    this.updateStatus();
    
    // Анимация успеха
    const cards = this.container.querySelectorAll('.review-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.transform = 'scale(1.05)';
        setTimeout(() => {
          card.style.transform = '';
        }, 200);
      }, index * 100);
    });
  }
  
  toggleAutoPlay() {
    if (this.autoPlayTimer) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }
  
  startAutoPlay() {
    if (this.totalPages <= 1) return;
    
    this.autoPlayTimer = setInterval(() => {
      if (this.currentPage >= this.totalPages - 1) {
        this.goToPage(0);
      } else {
        this.next();
      }
    }, this.options.autoPlayInterval);
    
    const autoPlayBtn = this.container.querySelector('#autoPlayBtn');
    if (autoPlayBtn) {
      autoPlayBtn.classList.add('active');
      autoPlayBtn.innerHTML = `
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z"/>
        </svg>
        Остановить
      `;
    }
  }
  
  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
    
    const autoPlayBtn = this.container.querySelector('#autoPlayBtn');
    if (autoPlayBtn) {
      autoPlayBtn.classList.remove('active');
      autoPlayBtn.innerHTML = `
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
        </svg>
        Автопролистывание
      `;
    }
  }
  
  updateStatus() {
    if (this.status) {
      this.status.textContent = this.getStatusText();
    }
  }
  
  updateData(newData) {
    this.data = [...newData];
    this.currentPage = 0;
    this.totalPages = Math.ceil(this.data.length / this.options.itemsPerPage);
    this.render();
    this.bindEvents();
    this.updateStatus();
  }
  
  destroy() {
    this.stopAutoPlay();
    this.container.innerHTML = '';
  }
}

// Данные отзывов
export const reviewsData = [
  {
    author: "Анна Петрова",
    location: "Краснодар",
    date: "15.12.2024",
    rating: 5,
    text: "Потрясающий сервис! Мастер Светлана сделала мне идеальную стрижку и окрашивание. Результат превзошел все ожидания. Обязательно вернусь еще!"
  },
  {
    author: "Мария Сидорова",
    location: "Геленджик",
    date: "12.12.2024",
    rating: 5,
    text: "Лучший салон в городе! Профессиональные мастера, уютная атмосфера, качественные материалы. Делаю маникюр уже полгода - всегда довольна."
  },
  {
    author: "Елена Козлова",
    location: "Сочи",
    date: "10.12.2024",
    rating: 5,
    text: "Впервые была в этом салоне. Очень понравилось отношение к клиентам и качество работы. Маникюр держится уже 3 недели!"
  },
  {
    author: "Ольга Новикова",
    location: "Анапа",
    date: "08.12.2024",
    rating: 5,
    text: "Спасибо за прекрасный сервис! Делала SPA-процедуры - чувствую себя обновленной. Персонал очень внимательный и профессиональный."
  },
  {
    author: "Ирина Волкова",
    location: "Новороссийск",
    date: "05.12.2024",
    rating: 5,
    text: "Отличный салон! Делаю здесь все процедуры уже год. Мастера настоящие профессионалы, всегда советуют что лучше подойдет."
  },
  {
    author: "Татьяна Морозова",
    location: "Туапсе",
    date: "03.12.2024",
    rating: 5,
    text: "Превосходное качество услуг! Особенно нравится работа с волосами. Мастер подобрала идеальный цвет и форму стрижки."
  },
  {
    author: "Наталья Соколова",
    location: "Армавир",
    date: "01.12.2024",
    rating: 5,
    text: "Очень довольна посещением салона! Чистота, порядок, профессиональный подход. Рекомендую всем подругам."
  },
  {
    author: "Юлия Лебедева",
    location: "Майкоп",
    date: "28.11.2024",
    rating: 5,
    text: "Лучший выбор для ухода за собой! Делаю здесь и маникюр, и прически. Всегда отличный результат и хорошее настроение."
  },
  {
    author: "Александра Иванова",
    location: "Краснодар",
    date: "25.11.2024",
    rating: 5,
    text: "Потрясающий мастер! Сделала мне идеальную прическу на свадьбу. Все гости были в восторге от результата!"
  },
  {
    author: "Виктория Смирнова",
    location: "Геленджик",
    date: "22.11.2024",
    rating: 5,
    text: "Отличный салон! Делаю здесь все процедуры уже больше года. Мастера настоящие профессионалы своего дела."
  },
  {
    author: "Екатерина Попова",
    location: "Сочи",
    date: "20.11.2024",
    rating: 5,
    text: "Великолепный сервис! Особенно понравилось отношение к клиентам. Мастер внимательно выслушала все пожелания."
  },
  {
    author: "Дарья Соколова",
    location: "Анапа",
    date: "18.11.2024",
    rating: 5,
    text: "Прекрасный салон! Делала окрашивание волос - результат превзошел все ожидания. Обязательно вернусь!"
  }
];
