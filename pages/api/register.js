export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'Пожалуйста, заполните все поля.' });
  }

  const token = process.env.BOT_TOKEN;
  const chatId = 339033504; // Telegram chat ID пользователя @VadimKtv

  const message = `
🔐 Новая регистрация на сайте SvetSalonPro:

👤 Имя: ${name}
📧 Email: ${email}
📱 Телефон: ${phone}
🔑 Пароль: ${password}
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description || 'Ошибка при отправке в Telegram');
    }

    return res.status(200).json({ message: 'Регистрация успешна!' });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка сервера: ' + error.message });
  }
}