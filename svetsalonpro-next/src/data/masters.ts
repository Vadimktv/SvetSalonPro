import type { Master } from '@/types';

export const masters: Master[] = [
  {
    id: 'svetlana',
    name: 'Светлана Ковалёва',
    role: 'Основатель и арт-директор',
    experience: '12 лет в индустрии',
    description:
      'Специалист по сложному окрашиванию и восстановлению волос. Создаёт индивидуальные программы ухода для каждого гостя.',
    specialties: ['AirTouch', 'Восстановление волос', 'Свадебные укладки'],
    image: {
      src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      width: 800,
      height: 1000
    }
  },
  {
    id: 'anastasia',
    name: 'Анастасия Яворская',
    role: 'Ведущий стилист ногтевого сервиса',
    experience: '8 лет опыта',
    description:
      'Мастер комбинированного маникюра и сложных дизайнов. Контролирует стандарты стерильности и обучает новых специалистов.',
    specialties: ['Аппаратный маникюр', 'Дизайн', 'Укрепление гелем'],
    image: {
      src: 'https://images.unsplash.com/photo-1559599238-234f8c8125d6?auto=format&fit=crop&w=800&q=80',
      width: 800,
      height: 1000
    }
  },
  {
    id: 'arina',
    name: 'Арина Погодина',
    role: 'Бьюти-эксперт по макияжу',
    experience: '7 лет на съёмках и мероприятиях',
    description:
      'Создаёт стойкие look’и для свадеб и fashion-съёмок. Сильна в нюдовых и сияющих техниках, работает с любыми тонами кожи.',
    specialties: ['Fashion макияж', 'Свадебные образы', 'Коррекция бровей'],
    image: {
      src: 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?auto=format&fit=crop&w=800&q=80',
      width: 800,
      height: 1000
    }
  },
  {
    id: 'valeria',
    name: 'Валерия Грин',
    role: 'Косметолог-эстетист',
    experience: '9 лет практики',
    description:
      'Подбирает программы glow-уходов и аппаратных процедур для безупречного тона кожи. Автор wellness-курсов для клиентов.',
    specialties: ['Аппаратная косметология', 'Мезотерапия', 'Уходы Medik8'],
    image: {
      src: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=800&q=80',
      width: 800,
      height: 1000
    }
  }
];
