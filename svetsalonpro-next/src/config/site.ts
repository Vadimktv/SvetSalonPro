export const siteConfig = {
  name: 'SvetSalonPro',
  shortName: 'SvetSalonPro',
  description:
    'Салон красоты в Геленджике: парикмахерские услуги, маникюр и педикюр, косметология и макияж с премиальным сервисом.',
  url: 'https://www.svetsalonpro.ru',
  locale: 'ru_RU',
  contact: {
    phone: '+7 (928) 428-88-87',
    whatsapp: 'https://wa.me/79284288887',
    telegram: 'https://t.me/SvetSalonPro',
    email: 'hello@svetsalonpro.ru'
  },
  address: {
    street: 'ул. Курзальная, 42',
    city: 'Геленджик',
    postalCode: '353460',
    country: 'Россия',
    lat: 44.5615,
    lng: 38.0761
  },
  workingHours: [
    { day: 'Понедельник — Пятница', time: '09:00 – 21:00' },
    { day: 'Суббота — Воскресенье', time: '10:00 – 20:00' }
  ],
  social: [
    { name: 'Instagram*', url: 'https://www.instagram.com/svetsalonpro', note: 'Meta признана экстремистской организацией' },
    { name: 'VK', url: 'https://vk.com/svetsalonpro' }
  ],
  nav: [
    { href: '#services', label: 'Услуги' },
    { href: '#masters', label: 'Мастера' },
    { href: '#portfolio', label: 'Портфолио' },
    { href: '#reviews', label: 'Отзывы' },
    { href: '#booking', label: 'Запись' },
    { href: '#contacts', label: 'Контакты' }
  ]
};

export type SiteConfig = typeof siteConfig;
