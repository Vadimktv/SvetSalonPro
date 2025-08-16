const fs = require('fs');
const path = require('path');

const BOOKED_TIMES_FILE = path.join(process.cwd(), 'pages/api/booked-times.json');

// Функция для чтения забронированного времени
function readBookedTimes() {
  try {
    if (fs.existsSync(BOOKED_TIMES_FILE)) {
      const data = fs.readFileSync(BOOKED_TIMES_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Ошибка чтения файла забронированного времени:', error);
  }
  return { bookedSlots: [] };
}

// Функция для записи забронированного времени
function writeBookedTimes(data) {
  try {
    fs.writeFileSync(BOOKED_TIMES_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Ошибка записи файла забронированного времени:', error);
    return false;
  }
}

// Функция для проверки доступности времени
function isTimeSlotAvailable(date, time) {
  const bookedTimes = readBookedTimes();
  return !bookedTimes.bookedSlots.some(slot => 
    slot.date === date && slot.time === time
  );
}

// Функция для получения доступных временных слотов на определенную дату
function getAvailableTimeSlots(date) {
  const bookedTimes = readBookedTimes();
  const bookedSlotsOnDate = bookedTimes.bookedSlots
    .filter(slot => slot.date === date)
    .map(slot => slot.time);
  
  const allTimeSlots = [];
  for (let hour = 9; hour < 20; hour++) {
    allTimeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    allTimeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  
  return allTimeSlots.filter(time => !bookedSlotsOnDate.includes(time));
}

// Функция для бронирования времени
function bookTimeSlot(date, time, name, phone, service) {
  const bookedTimes = readBookedTimes();
  
  // Проверяем, не занято ли уже это время
  if (!isTimeSlotAvailable(date, time)) {
    return { success: false, message: 'Это время уже занято' };
  }
  
  // Добавляем новое бронирование
  bookedTimes.bookedSlots.push({
    date,
    time,
    name,
    phone,
    service,
    bookedAt: new Date().toISOString()
  });
  
  // Сохраняем изменения
  if (writeBookedTimes(bookedTimes)) {
    return { success: true, message: 'Время успешно забронировано' };
  } else {
    return { success: false, message: 'Ошибка при сохранении бронирования' };
  }
}

export {
  readBookedTimes,
  writeBookedTimes,
  isTimeSlotAvailable,
  getAvailableTimeSlots,
  bookTimeSlot
};
