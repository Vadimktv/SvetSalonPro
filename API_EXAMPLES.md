# Примеры API запросов для SvetSalonPro

Этот файл содержит примеры API запросов для тестирования системы личного кабинета.

## 🔑 Аутентификация

### Получение текущего пользователя
```javascript
const { data: { user }, error } = await supabase.auth.getUser();
```

### Вход по email (magic link)
```javascript
const { error } = await supabase.auth.signInWithOtp({
    email: 'user@example.com',
    options: {
        emailRedirectTo: 'https://svetsalonpro.ru/pages/account.html'
    }
});
```

### Выход из системы
```javascript
const { error } = await supabase.auth.signOut();
```

## 👤 Профили пользователей

### Получение профиля
```javascript
const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', 'user-uuid')
    .single();
```

### Создание профиля
```javascript
const { error } = await supabase
    .from('profiles')
    .insert({
        id: 'user-uuid',
        email: 'user@example.com',
        full_name: 'Иван Иванов',
        phone: '+7 999 123-45-67'
    });
```

### Обновление профиля
```javascript
const { error } = await supabase
    .from('profiles')
    .update({
        full_name: 'Иван Петров',
        phone: '+7 999 987-65-43'
    })
    .eq('id', 'user-uuid');
```

## 🎯 Услуги

### Получение всех активных услуг
```javascript
const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('name');
```

### Получение услуг по категории
```javascript
const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('category', 'hair')
    .eq('is_active', true);
```

### Создание новой услуги (только для админов)
```javascript
const { error } = await supabase
    .from('services')
    .insert({
        name: 'Новая услуга',
        description: 'Описание услуги',
        price: 1500.00,
        duration_minutes: 60,
        category: 'hair'
    });
```

## ⏰ Временные слоты

### Получение доступных слотов на конкретную дату
```javascript
const { data: slots, error } = await supabase
    .from('slots')
    .select('*')
    .eq('date', '2024-01-15')
    .eq('available', true)
    .order('time');
```

### Получение слотов на неделю
```javascript
const { data: slots, error } = await supabase
    .from('slots')
    .select('*')
    .gte('date', '2024-01-15')
    .lt('date', '2024-01-22')
    .eq('available', true)
    .order('date, time');
```

### Создание нового слота
```javascript
const { error } = await supabase
    .from('slots')
    .insert({
        date: '2024-01-20',
        time: '14:00',
        available: true
    });
```

## 📅 Записи

### Получение записей пользователя
```javascript
const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
        *,
        services(name, price, duration_minutes),
        slots(date, time)
    `)
    .eq('user_id', 'user-uuid')
    .order('created_at', { ascending: false });
```

### Создание новой записи
```javascript
const { error } = await supabase
    .from('bookings')
    .insert({
        user_id: 'user-uuid',
        service_id: 'service-uuid',
        slot_id: 'slot-uuid',
        status: 'pending',
        notes: 'Дополнительные пожелания'
    });
```

### Обновление статуса записи
```javascript
const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', 'booking-uuid');
```

### Получение записи с деталями
```javascript
const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
        *,
        services(name, price, description),
        slots(date, time),
        profiles(full_name, email, phone)
    `)
    .eq('id', 'booking-uuid')
    .single();
```

## 🔍 Поиск и фильтрация

### Поиск услуг по названию
```javascript
const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .ilike('name', '%стрижка%')
    .eq('is_active', true);
```

### Получение записей по статусу
```javascript
const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .in('status', ['pending', 'confirmed'])
    .order('created_at');
```

### Получение записей по дате
```javascript
const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
        *,
        services(name),
        slots(date, time)
    `)
    .gte('slots.date', '2024-01-01')
    .lte('slots.date', '2024-01-31');
```

## 📊 Статистика

### Количество записей пользователя
```javascript
const { count, error } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', 'user-uuid');
```

### Статистика по статусам
```javascript
const { data: stats, error } = await supabase
    .from('bookings')
    .select('status')
    .eq('user_id', 'user-uuid');

// Подсчет статусов
const statusCounts = stats.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
}, {});
```

## 🚨 Обработка ошибок

### Пример с обработкой ошибок
```javascript
try {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', 'user-uuid');
    
    if (error) {
        console.error('Database error:', error);
        throw new Error('Ошибка загрузки записей');
    }
    
    return data;
} catch (error) {
    console.error('Request failed:', error);
    // Показать пользователю сообщение об ошибке
    alert('Произошла ошибка: ' + error.message);
}
```

### Проверка авторизации
```javascript
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
    // Пользователь не авторизован
    window.location.href = '/pages/account.html';
    return;
}
```

## 🔄 Подписка на изменения

### Подписка на изменения записей
```javascript
const subscription = supabase
    .channel('bookings_changes')
    .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `user_id=eq.${currentUser.id}`
    }, (payload) => {
        console.log('Booking changed:', payload);
        // Обновить UI
        loadBookings();
    })
    .subscribe();
```

### Отписка от изменений
```javascript
subscription.unsubscribe();
```

## 📱 Мобильная оптимизация

### Проверка мобильного устройства
```javascript
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    // Показать мобильную версию
    document.body.classList.add('mobile');
}
```

### Адаптивные запросы
```javascript
// На мобильных устройствах загружаем меньше данных
const limit = isMobile ? 10 : 50;

const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', 'user-uuid')
    .order('created_at', { ascending: false })
    .limit(limit);
```

## 🧪 Тестирование API

### Тестовые данные
```javascript
// Создание тестового пользователя
const testUser = {
    email: 'test@example.com',
    password: 'testpassword123'
};

// Создание тестовой услуги
const testService = {
    name: 'Тестовая услуга',
    price: 1000.00,
    category: 'test'
};

// Создание тестового слота
const testSlot = {
    date: '2024-12-31',
    time: '12:00',
    available: true
};
```

### Очистка тестовых данных
```javascript
// Удаление тестовых записей
await supabase
    .from('bookings')
    .delete()
    .eq('user_id', 'test-user-uuid');

// Удаление тестовых слотов
await supabase
    .from('slots')
    .delete()
    .eq('date', '2024-12-31');
```

## 📝 Логирование

### Логирование API запросов
```javascript
const logApiCall = (endpoint, params, result) => {
    console.log(`API Call: ${endpoint}`, {
        params,
        result,
        timestamp: new Date().toISOString()
    });
};

// Использование
const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', 'user-uuid');

logApiCall('GET /bookings', { user_id: 'user-uuid' }, { data, error });
```

---

**Примечание**: Все примеры предполагают, что Supabase клиент уже инициализирован и пользователь авторизован.
