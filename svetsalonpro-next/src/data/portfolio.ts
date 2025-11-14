import type { PortfolioItem } from '@/types';

export const portfolioCategories = [
  { value: 'all', label: 'Все проекты' },
  { value: 'hair', label: 'Волосы' },
  { value: 'nails', label: 'Маникюр' },
  { value: 'makeup', label: 'Макияж' },
  { value: 'cosmetology', label: 'Косметология' }
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'portfolio-1',
    title: 'AirTouch + тонирование',
    category: 'hair',
    description: 'Мягкий блонд с растяжкой и холодным нюансом, уход Kérastase.',
    image: {
      src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
      width: 1200,
      height: 1500
    }
  },
  {
    id: 'portfolio-2',
    title: 'Свадебный образ',
    category: 'makeup',
    description: 'Стойкий макияж с акцентом на глаза + собранные локоны с аксессуарами.',
    image: {
      src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
      width: 1200,
      height: 1500
    }
  },
  {
    id: 'portfolio-3',
    title: 'Дизайнерский маникюр',
    category: 'nails',
    description: 'Нюдовая база с художественной росписью и акцентным пальцем.',
    image: {
      src: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80',
      width: 1200,
      height: 1500
    }
  },
  {
    id: 'portfolio-4',
    title: 'Glow-уход',
    category: 'cosmetology',
    description: 'Программа сияния: ультразвук + мезотерапия + LED.',
    image: {
      src: 'https://images.unsplash.com/photo-1542838686-73e53765248a?auto=format&fit=crop&w=1200&q=80',
      width: 1200,
      height: 1500
    }
  },
  {
    id: 'portfolio-5',
    title: 'Hollywood waves',
    category: 'hair',
    description: 'Вечерняя укладка с эффектом зеркального блеска и фиксацией.',
    image: {
      src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
      width: 1200,
      height: 1500
    }
  },
  {
    id: 'portfolio-6',
    title: 'Fashion-макияж',
    category: 'makeup',
    description: 'Глянцевые веки, чистая кожа и акцент на скулы для съёмки.',
    image: {
      src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      width: 1200,
      height: 1500
    }
  }
];
