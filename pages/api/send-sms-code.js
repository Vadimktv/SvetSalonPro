// API для отправки SMS-кода на email
const http = require('http');
const smsStorage = require('./sms-storage.js');

function handleRequest(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const { email } = JSON.parse(body);

            if (!email) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Email is required' }));
                return;
            }

            // Генерируем 4-значный код
            const smsCode = Math.floor(1000 + Math.random() * 9000).toString();
            
            // Сохраняем код в хранилище
            smsStorage.saveCode(email, smsCode);

            // В реальном проекте здесь должна быть отправка email
            // Используем Nodemailer или другой сервис
            console.log('Отправляем SMS-код на email:', email, 'Код:', smsCode);

            // Имитация отправки email (в реальности здесь будет nodemailer)
            const emailContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">SvetSalon Pro</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">Код для входа в личный кабинет</p>
                    </div>
                    
                    <div style="background: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                        <h2 style="color: #374151; margin-bottom: 20px;">Ваш SMS-код для входа</h2>
                        
                        <p style="color: #6b7280; margin-bottom: 30px;">
                            Для входа в личный кабинет используйте следующий код:
                        </p>
                        
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0;">
                            <div style="font-size: 32px; font-weight: bold; color: #ec4899; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                ${smsCode}
                            </div>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
                            ⏰ Код действителен в течение 5 минут
                        </p>
                        
                        <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="color: #92400e; margin: 0; font-size: 14px;">
                                🔒 Не передавайте этот код никому. Сотрудники SvetSalon Pro никогда не запрашивают коды доступа.
                            </p>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                            Если вы не запрашивали код для входа, просто проигнорируйте это письмо.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                        <p>© 2024 SvetSalon Pro. Все права защищены.</p>
                    </div>
                </div>
            `;

            // В реальном проекте здесь будет отправка email
            // const transporter = nodemailer.createTransporter({
            //     service: 'gmail',
            //     auth: {
            //         user: process.env.EMAIL_USER,
            //         pass: process.env.EMAIL_PASS
            //     }
            // });
            
            // await transporter.sendMail({
            //     from: 'noreply@svetsalonpro.com',
            //     to: email,
            //     subject: 'SMS-код для входа в личный кабинет - SvetSalon Pro',
            //     html: emailContent
            // });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                message: 'SMS-код отправлен на email'
            }));

        } catch (error) {
            console.error('Error sending SMS code:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                error: 'Ошибка отправки SMS-кода',
                details: error.message 
            }));
        }
    });
}

// Экспортируем функцию для использования в server.js
module.exports = { handleRequest };
