# Настройка SMS-авторизации в SvetSalonPro

## 📱 Обзор

Система SMS-авторизации позволяет пользователям входить в личный кабинет по номеру телефона. Пользователь вводит номер, получает SMS-код, вводит его и авторизуется.

## 🔧 Техническая реализация

### Используемые технологии:
- **Supabase Auth** - для отправки SMS и верификации кодов
- **Twilio** - провайдер SMS (настраивается в Supabase)
- **JavaScript** - для обработки форм и UI

## ⚙️ Настройка в Supabase

### 1. Включение SMS-авторизации

1. **Войдите в Supabase Dashboard**
2. **Перейдите в Authentication → Settings**
3. **Включите "Enable phone confirmations"**
4. **Настройте SMS провайдера (Twilio)**

### 2. Настройка Twilio

1. **Создайте аккаунт в Twilio** (https://www.twilio.com)
2. **Получите Account SID и Auth Token**
3. **Купите номер телефона для отправки SMS**
4. **В Supabase Dashboard → Authentication → Settings → SMS Provider:**
   - Выберите "Twilio"
   - Введите Account SID
   - Введите Auth Token
   - Введите номер телефона

### 3. Настройка шаблона SMS

В Supabase Dashboard → Authentication → Settings → SMS Template:

```text
Ваш код подтверждения для SvetSalonPro: {{ .Code }}

Код действителен 10 минут.
```

## 🎯 Функциональность

### 1. **Переключение методов авторизации**
- Кнопки "Телефон" и "Email"
- Автоматическое переключение между формами
- Визуальная индикация активного метода

### 2. **Форматирование номера телефона**
- Автоматическое добавление `+7`
- Форматирование в виде `+7 (XXX) XXX-XX-XX`
- Валидация длины номера

### 3. **Отправка SMS**
- Проверка корректности номера
- Отправка OTP через Supabase
- Уведомление об успешной отправке

### 4. **Верификация кода**
- Модальное окно для ввода кода
- 6-значный код подтверждения
- Таймер для повторной отправки (60 секунд)
- Автоматическая авторизация при успешной верификации

### 5. **Повторная отправка**
- Кнопка "Отправить повторно"
- Таймер обратного отсчета
- Ограничение на частоту отправки

## 📋 Код реализации

### HTML структура:

```html
<!-- Переключение методов -->
<div class="flex bg-gray-100 rounded-lg p-1 mb-4">
    <button id="phoneAuthBtn" class="flex-1 py-2 px-4 rounded-md bg-pink-600 text-white">
        <i class="fas fa-mobile-alt mr-2"></i>Телефон
    </button>
    <button id="emailAuthBtn" class="flex-1 py-2 px-4 rounded-md text-gray-600">
        <i class="fas fa-envelope mr-2"></i>Email
    </button>
</div>

<!-- Форма телефона -->
<div id="phoneAuthSection">
    <input type="tel" id="phone" placeholder="+7 (___) ___-__-__">
    <button type="submit">Отправить код</button>
</div>

<!-- Модальное окно верификации -->
<div id="smsVerificationModal" class="hidden">
    <input type="text" id="smsCode" placeholder="000000" maxlength="6">
    <button id="verifyCodeBtn">Подтвердить</button>
    <button id="resendCodeBtn">Отправить повторно</button>
</div>
```

### JavaScript функции:

```javascript
// Обработка телефонной авторизации
async function handlePhoneAuth(phone) {
    const formattedPhone = formatPhoneForAuth(phone);
    const { error } = await client.auth.signInWithOtp({
        phone: formattedPhone,
        options: { shouldCreateUser: true }
    });
    
    if (!error) {
        showSMSVerificationModal(formattedPhone);
    }
}

// Верификация SMS
async function handleSMSVerification() {
    const { data, error } = await client.auth.verifyOtp({
        phone: phone,
        token: code,
        type: 'sms'
    });
    
    if (!error) {
        // Пользователь авторизован
        closeSMSVerificationModal();
    }
}
```

## 🔒 Безопасность

### 1. **Валидация номера**
- Проверка формата номера
- Валидация длины (10 цифр для России)
- Автоматическое форматирование

### 2. **Ограничения**
- Таймер на повторную отправку (60 секунд)
- Ограничение попыток верификации
- Автоматическое создание пользователя

### 3. **Защита от спама**
- Ограничение частоты отправки SMS
- Валидация кода на стороне сервера
- Автоматическое истечение кода

## 💰 Стоимость

### Twilio тарифы (примерно):
- **Регистрация:** Бесплатно
- **Номер телефона:** ~$1/месяц
- **SMS в России:** ~$0.05 за сообщение
- **SMS в других странах:** ~$0.02-0.10 за сообщение

### Рекомендации:
- Настройте лимиты на количество SMS в день
- Мониторьте использование через Twilio Dashboard
- Рассмотрите альтернативные провайдеры для снижения стоимости

## 🚀 Развертывание

### 1. **Настройка переменных окружения**
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

### 2. **Проверка работоспособности**
1. Отправьте тестовое SMS
2. Проверьте верификацию кода
3. Убедитесь в создании пользователя
4. Проверьте работу в разных браузерах

### 3. **Мониторинг**
- Отслеживайте успешность отправки SMS
- Мониторьте количество попыток верификации
- Следите за ошибками в консоли

## 🐛 Отладка

### Частые проблемы:

1. **SMS не отправляется**
   - Проверьте настройки Twilio
   - Убедитесь в достаточном балансе
   - Проверьте формат номера телефона

2. **Код не верифицируется**
   - Проверьте правильность кода
   - Убедитесь, что код не истек
   - Проверьте настройки Supabase

3. **Пользователь не создается**
   - Проверьте настройки `shouldCreateUser`
   - Убедитесь в правах доступа к базе данных

### Логи для отладки:
```javascript
console.log('Phone auth error:', error);
console.log('SMS verification error:', error);
console.log('Resend code error:', error);
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в консоли браузера
2. Убедитесь в правильности настроек Supabase
3. Проверьте баланс и настройки Twilio
4. Обратитесь к документации Supabase Auth
