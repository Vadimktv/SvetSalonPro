import { serviceCategories } from './services';

export const bookingServices = serviceCategories.map((category) => ({
  id: category.id,
  label: category.title,
  services: category.services.map((service) => ({
    value: service.id,
    label: service.name
  }))
}));

export const bookingMasters = [
  {
    value: 'svetlana-kovaleva',
    label: 'Светлана Ковалёва',
    categories: ['hair']
  },
  {
    value: 'anastasia-yavorskaya',
    label: 'Анастасия Яворская',
    categories: ['nails']
  },
  {
    value: 'arina-pogodina',
    label: 'Арина Погодина',
    categories: ['makeup']
  },
  {
    value: 'valeria-green',
    label: 'Валерия Грин',
    categories: ['cosmetology']
  }
];

export const bookingTimeSlots = [
  { value: '09:00', label: '09:00' },
  { value: '10:30', label: '10:30' },
  { value: '12:00', label: '12:00' },
  { value: '13:30', label: '13:30' },
  { value: '15:00', label: '15:00' },
  { value: '16:30', label: '16:30' },
  { value: '18:00', label: '18:00' }
];
