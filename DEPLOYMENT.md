# Развертывание SvetSalonPro на GitHub Pages

Пошаговая инструкция по развертыванию системы личного кабинета на GitHub Pages.

## 🚀 Подготовка к развертыванию

### 1. Создание GitHub репозитория

1. Перейдите на [github.com](https://github.com)
2. Нажмите "New repository"
3. Заполните форму:
   - **Repository name**: `SvetSalonPro`
   - **Description**: `Сайт салона красоты с системой личного кабинета`
   - **Visibility**: Public (или Private, если нужно)
   - **Initialize with**: оставьте пустым
4. Нажмите "Create repository"

### 2. Загрузка кода в репозиторий

```bash
# Клонируйте репозиторий
git clone https://github.com/yourusername/SvetSalonPro.git
cd SvetSalonPro

# Скопируйте все файлы проекта в папку
# (index.html, pages/, images/, и т.д.)

# Добавьте файлы в git
git add .

# Создайте первый коммит
git commit -m "Initial commit: сайт салона красоты с личным кабинетом"

# Отправьте код в репозиторий
git push origin main
```

## ⚙️ Настройка GitHub Pages

### 1. Включение GitHub Pages

1. В репозитории перейдите в **Settings**
2. В левом меню найдите **Pages**
3. В разделе **Source** выберите:
   - **Deploy from a branch**
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Нажмите **Save**

### 2. Настройка домена

1. В том же разделе **Pages** найдите **Custom domain**
2. Введите ваш домен: `svetsalonpro.ru`
3. Поставьте галочку **Enforce HTTPS**
4. Нажмите **Save**

### 3. Настройка DNS

В панели управления вашим доменом создайте следующие записи:

```
Тип: CNAME
Имя: @
Значение: yourusername.github.io

Тип: CNAME  
Имя: www
Значение: yourusername.github.io
```

**Альтернативно** (если ваш провайдер поддерживает A-записи):

```
Тип: A
Имя: @
Значение: 185.199.108.153

Тип: A
Имя: @
Значение: 185.199.109.153

Тип: A
Имя: @
Значение: 185.199.110.153

Тип: A
Имя: @
Значение: 185.199.111.153
```

## 🔧 Настройка Supabase

### 1. Обновление конфигурации

1. Откройте файл `supabase-config.js`
2. Замените значения на ваши реальные данные:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-actual-project-id.supabase.co',
    anonKey: 'your-actual-anon-key',
    // ... остальные настройки
};
```

### 2. Обновление Supabase настроек

1. В Supabase Dashboard перейдите в **Authentication** → **Settings**
2. Обновите **Site URL**: `https://svetsalonpro.ru`
3. В **Redirect URLs** добавьте: `https://svetsalonpro.ru/pages/account.html`
4. Сохраните изменения

### 3. Проверка RLS политик

Убедитесь, что все таблицы защищены Row Level Security:

```sql
-- Проверка RLS для всех таблиц
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## 📱 Тестирование развертывания

### 1. Проверка главной страницы

1. Откройте `https://svetsalonpro.ru`
2. Убедитесь, что сайт загружается корректно
3. Проверьте все разделы и функциональность

### 2. Тестирование личного кабинета

1. Перейдите на `https://svetsalonpro.ru/pages/account.html`
2. Попробуйте войти с помощью email
3. Проверьте создание профиля
4. Создайте тестовую запись

### 3. Проверка мобильной версии

1. Откройте сайт на мобильном устройстве
2. Проверьте адаптивность дизайна
3. Протестируйте функциональность на мобильных устройствах

## 🔄 Обновление сайта

### 1. Локальные изменения

```bash
# Внесите изменения в файлы
# Протестируйте локально

# Добавьте изменения в git
git add .

# Создайте коммит
git commit -m "Описание изменений"

# Отправьте в репозиторий
git push origin main
```

### 2. Автоматическое развертывание

GitHub Pages автоматически обновит сайт после каждого push в ветку `main`.

Время обновления: обычно 1-5 минут.

### 3. Проверка обновлений

1. Подождите несколько минут после push
2. Обновите страницу в браузере (Ctrl+F5)
3. Проверьте, что изменения применились

## 🚨 Устранение проблем

### Проблема: Сайт не загружается

**Возможные причины:**
- Неправильная настройка DNS
- Ошибки в коде
- Проблемы с GitHub Pages

**Решение:**
1. Проверьте настройки DNS (может занять до 24 часов)
2. Проверьте консоль браузера на ошибки
3. Убедитесь, что код корректно загружен в репозиторий

### Проблема: Личный кабинет не работает

**Возможные причины:**
- Неправильные ключи Supabase
- Ошибки в настройках аутентификации
- Проблемы с CORS

**Решение:**
1. Проверьте правильность ключей в `supabase-config.js`
2. Убедитесь, что домен добавлен в Supabase
3. Проверьте консоль браузера на ошибки

### Проблема: Медленная загрузка

**Возможные причины:**
- Большие изображения
- Неоптимизированный код
- Проблемы с CDN

**Решение:**
1. Оптимизируйте изображения (WebP формат)
2. Минифицируйте CSS и JavaScript
3. Используйте lazy loading для изображений

## 📊 Мониторинг

### 1. GitHub Pages Analytics

В настройках репозитория → **Pages** → **View analytics** вы можете увидеть:
- Количество просмотров
- Популярные страницы
- Источники трафика

### 2. Supabase Dashboard

В Supabase Dashboard отслеживайте:
- Количество пользователей
- Активность записей
- Ошибки аутентификации

### 3. Внешние инструменты

- **Google Analytics**: для детальной аналитики
- **Uptime Robot**: для мониторинга доступности
- **PageSpeed Insights**: для проверки производительности

## 🔒 Безопасность

### 1. HTTPS

GitHub Pages автоматически предоставляет SSL сертификат.

### 2. Защита от ботов

Добавьте в `robots.txt`:
```
User-agent: *
Disallow: /pages/
```

### 3. Ограничение доступа

Если нужно ограничить доступ:
1. Сделайте репозиторий приватным
2. Настройте доступ только для определенных пользователей

## 📈 Масштабирование

### 1. Увеличение лимитов

- **GitHub Pages**: до 100GB трафика в месяц
- **Supabase**: до 500MB базы данных на бесплатном плане

### 2. Кэширование

Добавьте заголовки кэширования в `.htaccess` (если используете Apache):

```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
</IfModule>
```

### 3. CDN

Для улучшения производительности рассмотрите:
- Cloudflare
- Netlify
- Vercel

## 📞 Поддержка

### 1. GitHub Support

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Community](https://github.com/orgs/community/discussions)

### 2. Supabase Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

### 3. Общие вопросы

- Stack Overflow
- GitHub Issues в вашем репозитории

---

**Важно**: После внесения изменений в конфигурацию всегда тестируйте функциональность перед развертыванием в продакшн.
