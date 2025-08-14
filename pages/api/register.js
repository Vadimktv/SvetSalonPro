export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, phone, date, time, serviceCategory, service } = req.body;

  if (!name || !phone || !date || !time || !serviceCategory || !service) {
    return res.status(400).json({ message: 'Пожалуйста, заполните все поля.' });
  }

  const token = process.env.BOT_TOKEN;
  const chatId = 339033504; // Telegram chat ID пользователя @VadimKtv

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
    gel: 'Укрепление гелем (1300 ₽)',
    // Услуги маникюра
    combo_manicure: 'Комбинированный маникюр (1500 ₽)'
  };

  const categoryName = categoryNames[serviceCategory] || 'Неизвестная категория';
  const serviceName = serviceNames[service] || 'Неизвестная услуга';

  const message = `
🎉 Новая запись на сайте SvetSalonPro!

👤 Имя: ${name}
📱 Телефон: ${phone}
📅 Дата: ${date}
🕐 Время: ${time}
📋 Категория: ${categoryName}
✨ Услуга: ${serviceName}

📍 Адрес: г. Геленджик, ул. Одесская, 3А, корпус 3
🌐 Сайт: SvetSalonPro.ru
  `;

  try {
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

    if (!data.ok) {
      throw new Error(data.description || 'Ошибка при отправке в Telegram');
    }

    return res.status(200).json({ 
      success: true,
      message: 'Запись успешно отправлена! Мы свяжемся с вами в ближайшее время.' 
    });
  } catch (error) {
    console.error('Ошибка при отправке в Telegram:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Ошибка при отправке заявки. Попробуйте позже или свяжитесь с нами по телефону.' 
    });
  }
}