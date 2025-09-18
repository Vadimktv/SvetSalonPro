import type { ServiceCategory } from '@/types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'hair',
    title: 'Парикмахерские услуги',
    highlight: 'Авторские техники окрашивания, уходы и укладки',
    description:
      'Работаем с премиальными марками Redken, Davines и Kérastase. Создаём натуральные оттенки и блеск без повреждений.',
    services: [
      {
        id: 'hair-coloring-premium',
        name: 'Многоуровневое окрашивание',
        description: 'AirTouch, Shatush или Balayage с тотальной защитой волос',
        priceFrom: 7900,
        duration: 210,
        category: 'Парикмахерские услуги'
      },
      {
        id: 'hair-treatment',
        name: 'SPA-уход и реконструкция',
        description: 'Программы восстановления по типу волос + массаж кожи головы',
        priceFrom: 3200,
        duration: 75,
        category: 'Парикмахерские услуги'
      },
      {
        id: 'hair-style',
        name: 'Вечерняя укладка',
        description: 'Голливудские волны, гладкие пучки и локоны с фиксацией',
        priceFrom: 2800,
        duration: 90,
        category: 'Парикмахерские услуги'
      }
    ]
  },
  {
    id: 'nails',
    title: 'Маникюр и педикюр',
    highlight: 'Стерильность и дизайн под образ',
    description:
      'Аппаратные техники, комбинированные укрепления и палитра трендовых оттенков. Одноразовые материалы и контроль стерильности.',
    services: [
      {
        id: 'nails-combo',
        name: 'Комбо: маникюр + педикюр',
        description: 'Экспресс-уход за руками и ногами в четыре руки',
        priceFrom: 4500,
        duration: 120,
        category: 'Маникюр и педикюр'
      },
      {
        id: 'nails-design',
        name: 'Дизайнерский маникюр',
        description: 'Арт-роспись, втирки, аэрография, объемные элементы',
        priceFrom: 2600,
        duration: 120,
        category: 'Маникюр и педикюр'
      },
      {
        id: 'nails-care',
        name: 'Smart-педикюр',
        description: 'Глубокая обработка стоп с заботой о безопасности',
        priceFrom: 3400,
        duration: 105,
        category: 'Маникюр и педикюр'
      }
    ]
  },
  {
    id: 'cosmetology',
    title: 'Эстетическая косметология',
    highlight: 'Авторские программы glow-уходов и лифтинга',
    description:
      'Аппаратные методики, мезотерапия, пилинги и уходы Medik8. Индивидуальные схемы под вашу кожу.',
    services: [
      {
        id: 'cosmo-clean',
        name: 'Детокс-уход и чистка',
        description: 'Ультразвуковая чистка + энзимный пилинг + альгинатная маска',
        priceFrom: 4200,
        duration: 100,
        category: 'Эстетическая косметология'
      },
      {
        id: 'cosmo-lift',
        name: 'RF-лифтинг лица и шеи',
        description: 'Подтяжка и укрепление каркаса без длительной реабилитации',
        priceFrom: 5800,
        duration: 90,
        category: 'Эстетическая косметология'
      },
      {
        id: 'cosmo-meso',
        name: 'Мезотерапия glow',
        description: 'Составы с витаминами, аминокислотами и пептидами для сияния кожи',
        priceFrom: 6700,
        duration: 75,
        category: 'Эстетическая косметология'
      }
    ]
  },
  {
    id: 'makeup',
    title: 'Макияж и образ',
    highlight: 'Съёмочные и вечерние look’и без чувства маски',
    description:
      'Подберем тон, который держится до 18 часов, добавим стайлинг и аксессуары. Возможен выезд мастера.',
    services: [
      {
        id: 'makeup-evening',
        name: 'Вечерний макияж',
        description: 'Премиальная декоративная косметика и ресницы по желанию',
        priceFrom: 3300,
        duration: 75,
        category: 'Макияж и образ'
      },
      {
        id: 'makeup-bridal',
        name: 'Свадебный образ «под ключ»',
        description: 'Репетиция, макияж, укладка, помощь со сборкой аксессуаров',
        priceFrom: 9800,
        duration: 240,
        category: 'Макияж и образ'
      },
      {
        id: 'makeup-photoshoot',
        name: 'Beauty-сопровождение на съёмке',
        description: 'Мобильный набор и коррекции в течение всего процесса',
        priceFrom: 5200,
        duration: 180,
        category: 'Макияж и образ'
      }
    ]
  }
];

export const allServices = serviceCategories.flatMap((category) => category.services);

export const serviceOptions = allServices.map((service) => ({
  value: service.id,
  label: service.name,
  category: service.category
}));

export const serviceCategoryOptions = serviceCategories.map((category) => ({
  value: category.id,
  label: category.title
}));
