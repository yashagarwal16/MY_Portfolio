const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail email
                pass: process.env.EMAIL_PASS  // Your Gmail App Password
            }
        });
    }

    // Send contact form email to your inbox
    async sendContactEmail(contactData) {
        const { name, email, subject, message } = contactData;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.CONTACT_EMAIL, // Where you want to receive messages
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #00d4ff, #00ffff); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h2 style="color: white; margin: 0; font-family: 'Orbitron', monospace;">🤖 JARVIS Portfolio Contact</h2>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h3 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #00d4ff; padding-bottom: 10px;">New Contact Form Submission</h3>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #00d4ff;">👤 Name:</strong>
                            <p style="margin: 5px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">${name}</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #00d4ff;">📧 Email:</strong>
                            <p style="margin: 5px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">${email}</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #00d4ff;">📋 Subject:</strong>
                            <p style="margin: 5px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">${subject}</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #00d4ff;">💬 Message:</strong>
                            <div style="margin: 5px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #00d4ff;">
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        
                        <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 5px; border-left: 4px solid #2196f3;">
                            <strong style="color: #1976d2;">📅 Received:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </div>
                        
                        <div style="margin-top: 20px; text-align: center;">
                            <a href="mailto:${email}" style="background: #00d4ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold;">Reply to ${name}</a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                        <p>This email was sent from your JARVIS Portfolio contact form</p>
                        <p>🤖 Powered by YASH AGARWAL AI Systems</p>
                    </div>
                </div>
            `,
            replyTo: email
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('📧 Email sent successfully:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Email sending failed:', error);
            throw new Error('Failed to send email notification');
        }
    }

    // Send automated reply to the sender
    async sendAutoReply(contactData) {
        const { name, email, subject } = contactData;

        const autoReplyOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Thank you for contacting Yash Agarwal - Auto Reply`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: white; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #00d4ff, #00ffff); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h2 style="color: white; margin: 0; font-family: 'Orbitron', monospace;">🤖 JARVIS Auto-Reply System</h2>
                    </div>
                    
                    <div style="padding: 30px; background: #111111; border-radius: 0 0 10px 10px;">
                        <h3 style="color: #00d4ff; margin-bottom: 20px;">Hello ${name},</h3>
                        
                        <p style="color: #ffffff; line-height: 1.6; margin-bottom: 20px;">
                            Thank you for reaching out through my portfolio contact form. This is an automated confirmation that your message has been received successfully.
                        </p>
                        
                        <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #00d4ff; margin: 20px 0;">
                            <strong style="color: #00ffff;">📋 Your Message Details:</strong><br>
                            <strong style="color: #00d4ff;">Subject:</strong> ${subject}<br>
                            <strong style="color: #00d4ff;">Received:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </div>
                        
                        <p style="color: #ffffff; line-height: 1.6; margin-bottom: 20px;">
                            I appreciate your interest in my work and will review your message carefully. You can expect a personal response within 24-48 hours.
                        </p>
                        
                        <div style="background: rgba(0, 255, 136, 0.1); padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <strong style="color: #00ff88;">🚀 In the meantime, feel free to:</strong>
                            <ul style="color: #ffffff; margin: 10px 0;">
                                <li>Explore my projects: <a href="https://your-portfolio-domain.com/project.html" style="color: #00d4ff;">Project Database</a></li>
                                <li>Connect on LinkedIn: <a href="https://www.linkedin.com/in/yash-agarwal-632418259/" style="color: #00d4ff;">Yash Agarwal</a></li>
                                <li>Check out my GitHub: <a href="https://github.com/yashagarwal16" style="color: #00d4ff;">GitHub</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(autoReplyOptions);
            console.log('🤖 Auto-reply sent successfully:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Auto-reply sending failed:', error);
            throw new Error('Failed to send auto-reply email');
        }
    }
}

module.exports = EmailService;
