// Модуль для хранения SMS-кодов
// В реальном проекте используйте базу данных

class SmsCodeStorage {
    constructor() {
        this.codes = new Map();
    }

    // Сохранить код
    saveCode(email, code) {
        this.codes.set(email, {
            code: code,
            timestamp: Date.now(),
            expiresAt: Date.now() + (5 * 60 * 1000) // 5 минут
        });
        console.log(`Код сохранен для ${email}: ${code}`);
    }

    // Получить код
    getCode(email) {
        return this.codes.get(email);
    }

    // Проверить код
    verifyCode(email, code) {
        const savedData = this.codes.get(email);
        
        if (!savedData) {
            return { valid: false, error: 'Код не найден' };
        }

        // Проверяем время жизни
        if (Date.now() > savedData.expiresAt) {
            this.codes.delete(email);
            return { valid: false, error: 'Код истек' };
        }

        // Проверяем код
        if (savedData.code !== code) {
            return { valid: false, error: 'Неверный код' };
        }

        // Код верный - удаляем его
        this.codes.delete(email);
        return { valid: true };
    }

    // Очистить истекшие коды
    cleanup() {
        const now = Date.now();
        for (const [email, data] of this.codes.entries()) {
            if (now > data.expiresAt) {
                this.codes.delete(email);
                console.log(`Удален истекший код для ${email}`);
            }
        }
    }
}

// Создаем единственный экземпляр
const smsStorage = new SmsCodeStorage();

// Очищаем истекшие коды каждые 5 минут
setInterval(() => {
    smsStorage.cleanup();
}, 5 * 60 * 1000);

module.exports = smsStorage;
