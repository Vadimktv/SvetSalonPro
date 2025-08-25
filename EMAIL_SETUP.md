# Настройка отправки Email

## 🔧 **Текущее состояние**

### **Что работает:**
- ✅ Генерация 4-значного SMS-кода
- ✅ Сохранение кода в памяти сервера
- ✅ Проверка кода и времени жизни
- ✅ Красивый HTML шаблон email
- ✅ API endpoints для отправки и проверки

### **Что нужно настроить:**
- ❌ Реальная отправка email через SMTP
- ❌ Настройка email сервиса

## 📧 **Настройка Nodemailer**

### **1. Установка зависимостей:**
```bash
npm install nodemailer
```

### **2. Настройка переменных окружения:**
Создайте файл `.env` в корне проекта:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@svetsalonpro.com
```

### **3. Обновление send-sms-code.js:**

Замените закомментированный код в `pages/api/send-sms-code.js`:

```javascript
const nodemailer = require('nodemailer');

// Создаем транспортер
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Отправляем email
await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'SMS-код для входа в личный кабинет - SvetSalon Pro',
    html: emailContent
});
```

## 🔐 **Настройка Gmail**

### **1. Включение 2FA:**
1. Перейдите в настройки Google аккаунта
2. Включите двухфакторную аутентификацию
3. Создайте пароль приложения для "Почта"

### **2. Получение пароля приложения:**
1. Настройки аккаунта → Безопасность
2. "Пароли приложений" → "Почта"
3. Скопируйте сгенерированный пароль

## 🚀 **Альтернативные email сервисы**

### **SendGrid:**
```javascript
const transporter = nodemailer.createTransporter({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});
```

### **Mailgun:**
```javascript
const transporter = nodemailer.createTransporter({
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_PASS
    }
});
```

### **AWS SES:**
```javascript
const transporter = nodemailer.createTransporter({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.AWS_SES_USER,
        pass: process.env.AWS_SES_PASS
    }
});
```

## 📋 **Полная настройка**

### **1. Установка зависимостей:**
```bash
npm install nodemailer dotenv
```

### **2. Создание .env файла:**
```env
# Email настройки
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@svetsalonpro.com

# Supabase настройки (если используется)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
```

### **3. Обновление server.js:**
```javascript
require('dotenv').config();
```

### **4. Тестирование:**
1. Запустите сервер: `node server.js`
2. Откройте личный кабинет
3. Введите email
4. Проверьте почту на наличие кода

## 🔒 **Безопасность**

### **Рекомендации:**
- ✅ Используйте пароли приложений
- ✅ Не храните пароли в коде
- ✅ Используйте HTTPS
- ✅ Ограничьте количество попыток
- ✅ Логируйте попытки входа

### **Дополнительные меры:**
- Rate limiting для API
- Валидация email адресов
- Мониторинг подозрительной активности

## 🎯 **Результат**

После настройки:
- ✅ Коды будут приходить на реальный email
- ✅ Безопасная авторизация
- ✅ Профессиональный внешний вид
- ✅ Надежная система входа
