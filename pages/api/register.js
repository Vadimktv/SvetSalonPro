import { bookTimeSlot } from './booked-times.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Логируем входящие данные для отладки
  console.log('Получены данные:', req.body);

  const { name, phone, date, time, serviceCategory, service } = req.body;

  if (!name || !phone || !date || !time || !serviceCategory || !service) {
    console.log('Отсутствуют обязательные поля:', { name, phone, date, time, serviceCategory, service });
    return res.status(400).json({ message: 'Пожалуйста, заполните все поля.' });
  }

  // Проверяем доступность времени
  const bookingResult = bookTimeSlot(date, time, name, phone, service);
  if (!bookingResult.success) {
    return res.status(400).json({ 
      success: false,
      message: bookingResult.message 
    });
  }

  const token = process.env.BOT_TOKEN;
  const chatId = 339033504; // Telegram chat ID пользователя @VadimKtv
  
  // Проверяем наличие токена
  if (!token) {
    console.error('Отсутствует BOT_TOKEN в переменных окружения');
    return res.status(500).json({ 
      success: false,
      message: 'Ошибка конфигурации сервера. Свяжитесь с администратором.' 
    });
  }

  // Получаем названия категорий и услуг
  const categoryNames = {
    hair: '✂️ Парикмахерские услуги',
    manicure: '💅 Услуги маникюра'
  };

  const serviceNames = {
    // Парикмахерские услуги
    spa: 'SPA процедуры (от 800 ₽)',
    womens_haircut: 'Женская стрижка (от 700 ₽)',
    mens_haircut: 'Мужская стрижка (от 700 ₽)',
    mens_machine: 'Мужская стрижка под машинку (от 600 ₽)',
    coloring: 'Окрашивание волос (от 800 ₽)',
    highlighting: 'Мелирование волос (1200 ₽)',
    lamination: 'Ламинирование волос (1000 ₽)',
    coloristics: 'Колористика волос (от 2800 ₽)',
    // Услуги маникюра
    combo_manicure: 'Комбинированный маникюр (1500 ₽)',
    classic_manicure: 'Классический маникюр (700 ₽)',
    nail_repair: 'Ремонт одного ногтя (300 ₽)',
    base_biogell: 'Укрепление базой или биогелем (800 ₽)',
    removal: 'Снятие покрытия (400 ₽)'
  };

  const categoryName = categoryNames[serviceCategory] || 'Неизвестная категория';
  const serviceName = serviceNames[service] || 'Неизвестная услуга';

  // Логируем названия для отладки
  console.log('Категория:', serviceCategory, '->', categoryName);
  console.log('Услуга:', service, '->', serviceName);

  const message = `
🎉 Новая запись на сайте SvetSalonPro!

👤 Имя: ${name}
📱 Телефон: ${phone}
📅 Дата: ${date}
🕐 Время: ${time}
📋 Категория: ${categoryName}
✨ Услуга: ${serviceName}

📍 Адрес: г. Геленджик, ул. Одесская, 3А, корпус 10
🌐 Сайт: SvetSalonPro.ru
  `;

  try {
    console.log('Отправляем в Telegram...');
    console.log('Токен:', token ? 'Есть' : 'Отсутствует');
    console.log('Chat ID:', chatId);
    
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    console.log('Ответ Telegram API:', data);

    if (!data.ok) {
      throw new Error(data.description || 'Ошибка при отправке в Telegram');
    }

    return res.status(200).json({ 
      success: true,
      message: 'Запись успешно отправлена! Мы свяжемся с вами в ближайшее время.' 
    });
  } catch (error) {
    console.error('Ошибка при отправке в Telegram:', error);
    
    // Возвращаем более подробную информацию об ошибке
    return res.status(500).json({ 
      success: false,
      message: 'Ошибка при отправке заявки. Попробуйте позже или свяжитесь с нами по телефону.',
      error: error.message,
      details: {
        token: token ? 'Есть' : 'Отсутствует',
        chatId: chatId,
        serviceCategory: serviceCategory,
        service: service
      }
    });
  }
}