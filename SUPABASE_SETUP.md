# Настройка Supabase для SvetSalonPro

## 1. Создание проекта в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "Start your project"
3. Войдите или зарегистрируйтесь
4. Создайте новый проект:
   - **Name**: SvetSalonPro
   - **Database Password**: придумайте надежный пароль
   - **Region**: выберите ближайший к вам регион
   - **Pricing Plan**: Free tier

## 2. Настройка аутентификации

1. В левом меню перейдите в **Authentication** → **Settings**
2. В разделе **Site URL** укажите: `https://svetsalonpro.ru`
3. В разделе **Redirect URLs** добавьте: `https://svetsalonpro.ru/pages/account.html`
4. Сохраните настройки

## 3. Создание таблиц базы данных

Перейдите в **SQL Editor** и выполните следующие команды:

### Таблица профилей пользователей
```sql
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи могут читать и обновлять только свой профиль
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
```

### Таблица услуг
```sql
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Политика: все могут читать активные услуги
CREATE POLICY "Anyone can view active services" ON services
    FOR SELECT USING (is_active = true);
```

### Таблица временных слотов
```sql
CREATE TABLE slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, time)
);

-- Включаем RLS
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;

-- Политика: все могут читать слоты
CREATE POLICY "Anyone can view slots" ON slots
    FOR SELECT USING (true);

-- Политика: аутентифицированные пользователи могут создавать слоты
CREATE POLICY "Authenticated users can create slots" ON slots
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Таблица записей
```sql
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
    slot_id UUID REFERENCES slots(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи могут читать только свои записи
CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT USING (auth.uid() = user_id);

-- Политика: пользователи могут создавать записи
CREATE POLICY "Users can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Политика: пользователи могут обновлять свои записи
CREATE POLICY "Users can update own bookings" ON bookings
    FOR UPDATE USING (auth.uid() = user_id);
```

## 4. Добавление тестовых данных

### Добавление услуг
```sql
INSERT INTO services (name, description, price, duration_minutes, category) VALUES
('Женская стрижка', 'Стрижка любой сложности с укладкой', 1500.00, 60, 'hair'),
('Мужская стрижка', 'Стрижка машинкой или ножницами', 800.00, 45, 'hair'),
('Окрашивание волос', 'Окрашивание в любой цвет', 2500.00, 120, 'hair'),
('Маникюр', 'Классический маникюр', 1200.00, 60, 'nails'),
('Педикюр', 'Классический педикюр', 1500.00, 90, 'nails'),
('Массаж лица', 'Омолаживающий массаж', 2000.00, 60, 'spa'),
('SPA процедуры', 'Комплексный уход за телом', 3500.00, 120, 'spa');
```

### Добавление временных слотов на ближайшие дни
```sql
-- Генерируем слоты на ближайшие 30 дней
INSERT INTO slots (date, time, available)
SELECT 
    (CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 29))::date as date,
    time_slot::time as time,
    true as available
FROM (
    VALUES 
        ('09:00'), ('09:30'), ('10:00'), ('10:30'), ('11:00'), ('11:30'),
        ('12:00'), ('12:30'), ('13:00'), ('13:30'), ('14:00'), ('14:30'),
        ('15:00'), ('15:30'), ('16:00'), ('16:30'), ('17:00'), ('17:30'),
        ('18:00'), ('18:30'), ('19:00'), ('19:30'), ('20:00')
) AS time_slots(time_slot)
ON CONFLICT (date, time) DO NOTHING;
```

## 5. Настройка функций и триггеров

### Функция для автоматического обновления updated_at
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для profiles
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Триггер для bookings
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Функция для проверки доступности слота
```sql
CREATE OR REPLACE FUNCTION check_slot_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Проверяем, не занят ли уже слот
    IF EXISTS (
        SELECT 1 FROM bookings 
        WHERE slot_id = NEW.slot_id 
        AND status NOT IN ('cancelled')
    ) THEN
        RAISE EXCEPTION 'Slot is already booked';
    END IF;
    
    -- Помечаем слот как недоступный
    UPDATE slots SET available = false WHERE id = NEW.slot_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для проверки доступности при создании записи
CREATE TRIGGER check_slot_availability_trigger
    BEFORE INSERT ON bookings
    FOR EACH ROW EXECUTE FUNCTION check_slot_availability();
```

## 6. Получение ключей API

1. В левом меню перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL** (например: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** ключ

## 7. Обновление кода

В файле `pages/account.html` замените:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

На ваши реальные значения:
```javascript
const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 8. Настройка email шаблонов (опционально)

1. В **Authentication** → **Email Templates**
2. Настройте шаблоны для:
   - **Confirm signup** - подтверждение регистрации
   - **Magic Link** - ссылка для входа
   - **Change email address** - смена email

## 9. Тестирование

1. Откройте страницу `/pages/account.html`
2. Попробуйте войти с помощью email
3. Проверьте создание профиля
4. Создайте тестовую запись
5. Проверьте отображение записей

## 10. Безопасность

- Все таблицы защищены Row Level Security (RLS)
- Пользователи могут видеть и изменять только свои данные
- Аутентификация через Supabase Auth
- Magic link вместо паролей

## 11. Мониторинг

В **Dashboard** → **Logs** вы можете отслеживать:
- Попытки входа
- SQL запросы
- Ошибки аутентификации

## 12. Резервное копирование

Supabase автоматически создает резервные копии каждые 24 часа.
Для ручного экспорта используйте **Database** → **Backups**.
