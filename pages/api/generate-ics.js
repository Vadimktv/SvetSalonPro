function generateICSFile(title, description, startDate, startTime, duration = 60) {
    // Парсим дату и время
    const [year, month, day] = startDate.split('-');
    const [hours, minutes] = startTime.split(':');
    
    // Создаем объект даты начала (локальное время)
    const start = new Date(year, month - 1, day, hours, minutes);
    // Создаем объект даты окончания (добавляем duration минут)
    const end = new Date(start.getTime() + duration * 60000);
    
    // Форматируем даты для iCalendar (формат: YYYYMMDDTHHMMSS)
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    };
    
    const startFormatted = formatDate(start);
    const endFormatted = formatDate(end);
    const nowFormatted = formatDate(new Date());
    
    // Генерируем уникальный ID
    const uid = `booking-${Date.now()}@svetsalonpro.ru`;
    
    // Адрес салона
    const location = 'г. Геленджик, ул. Одесская, 3А, корпус 10';
    
    // Экранируем специальные символы для iCalendar
    const escapeICS = (text) => {
        return text.replace(/\\/g, '\\\\')
                   .replace(/;/g, '\\;')
                   .replace(/,/g, '\\,')
                   .replace(/\n/g, '\\n');
    };
    
    const safeTitle = escapeICS(title);
    const safeDescription = escapeICS(description);
    const safeLocation = escapeICS(location);
    
    // Создаем содержимое .ics файла
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SvetSalonPro//Booking System//RU
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${nowFormatted}
DTSTART:${startFormatted}
DTEND:${endFormatted}
SUMMARY:${safeTitle}
DESCRIPTION:${safeDescription}
LOCATION:${safeLocation}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
    
    return icsContent;
}

function handleRequest(req, res) {
    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
        return;
    }

    const url = require('url');
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;

    const { title, description, date, time, duration } = query;

    if (!title || !date || !time) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Missing required parameters: title, date, time');
        return;
    }

    try {
        const icsContent = generateICSFile(
            decodeURIComponent(title),
            description ? decodeURIComponent(description) : '',
            date,
            time,
            duration ? parseInt(duration) : 60
        );

        const filename = `Запись_SvetSalonPro_${date}_${time.replace(':', '-')}.ics`;

        res.writeHead(200, {
            'Content-Type': 'text/calendar;charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}"`
        });
        res.end(icsContent, 'utf-8');
    } catch (error) {
        console.error('Error generating ICS file:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

module.exports = { handleRequest, generateICSFile };

