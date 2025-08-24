// Конфигурация Supabase для SvetSalonPro
// Замените эти значения на ваши реальные данные из Supabase Dashboard

const SUPABASE_CONFIG = {
    // URL вашего проекта Supabase
    url: 'https://iaezefurqmmgubdgqakt.supabase.co',
    
    // Публичный анонимный ключ
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZXplZnVycW1tZ3ViZGdxYWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NTk3NjQsImV4cCI6MjA3MTUzNTc2NH0.-Puoiddwu_xIx9BaHM0BBfbsULdU0Ljzh6uQleVToBQ',
    
    // Настройки аутентификации
    auth: {
        // URL для перенаправления после входа
        redirectTo: 'https://svetsalonpro.ru/pages/account.html',
        
        // Автоматическое обновление токена
        autoRefreshToken: true,
        
        // Сохранение сессии в localStorage
        persistSession: true,
        
        // Детекция URL для входа
        detectSessionInUrl: true
    },
    
    // Настройки базы данных
    db: {
        // Схема по умолчанию
        schema: 'public',
        
        // Таймаут запросов (в миллисекундах)
        timeout: 10000
    }
};

// Функция для инициализации Supabase клиента
function initSupabaseClient() {
    if (typeof supabase !== 'undefined') {
        return supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
            auth: SUPABASE_CONFIG.auth,
            db: SUPABASE_CONFIG.db
        });
    } else {
        console.error('Supabase SDK не загружен');
        return null;
    }
}

// Экспорт конфигурации
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
} else {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    window.initSupabaseClient = initSupabaseClient;
}
