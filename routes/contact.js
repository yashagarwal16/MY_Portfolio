const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { authenticateToken } = require('../middleware/auth');

// Email configuration
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// WhatsApp configuration (using Twilio)
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Contact form submission
router.post('/submit', authenticateToken, async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Please enter a valid email address'
            });
        }
        
        // Prepare email content
        const emailContent = `
            <div style="font-family: 'Orbitron', monospace; background: #0a0a0a; color: #ffffff; padding: 20px; border-radius: 10px;">
                <h2 style="color: #00d4ff; text-align: center; margin-bottom: 20px;">
                    🤖 NEW MESSAGE FROM PORTFOLIO CONTACT FORM
                </h2>
                
                <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid #00d4ff; border-radius: 8px; padding: 15px; margin: 10px 0;">
                    <h3 style="color: #00ffff; margin-bottom: 10px;">SENDER INFORMATION:</h3>
                    <p><strong style="color: #00d4ff;">Name:</strong> ${name}</p>
                    <p><strong style="color: #00d4ff;">Email:</strong> ${email}</p>
                    <p><strong style="color: #00d4ff;">Subject:</strong> ${subject}</p>
                </div>
                
                <div style="background: rgba(0, 255, 255, 0.1); border: 1px solid #00ffff; border-radius: 8px; padding: 15px; margin: 10px 0;">
                    <h3 style="color: #00ffff; margin-bottom: 10px;">MESSAGE CONTENT:</h3>
                    <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>
                
                <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #00d4ff;">
                    <p style="color: #888888; font-size: 12px;">
                        Sent from YASH AGARWAL Portfolio System<br>
                        Timestamp: ${new Date().toLocaleString()}
                    </p>
                </div>
            </div>
        `;
        
        // Send email
        const emailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER, // your email where you want to receive messages
            subject: `🤖 Portfolio Contact: ${subject}`,
            html: emailContent,
            replyTo: email
        };
        
        await emailTransporter.sendMail(emailOptions);
        
        // Prepare WhatsApp message
        const whatsappMessage = `
🤖 *NEW PORTFOLIO MESSAGE*

*From:* ${name}
*Email:* ${email}
*Subject:* ${subject}

*Message:*
${message}

*Time:* ${new Date().toLocaleString()}
        `.trim();
        
        // Send WhatsApp message
        if (process.env.WHATSAPP_NUMBER && process.env.TWILIO_WHATSAPP_NUMBER) {
            await twilioClient.messages.create({
                body: whatsappMessage,
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                to: `whatsapp:${process.env.WHATSAPP_NUMBER}`
            });
        }
        
        // Send confirmation email to sender
        const confirmationEmail = `
            <div style="font-family: 'Orbitron', monospace; background: #0a0a0a; color: #ffffff; padding: 20px; border-radius: 10px;">
                <h2 style="color: #00d4ff; text-align: center; margin-bottom: 20px;">
                    🤖 MESSAGE RECEIVED - YASH AGARWAL PORTFOLIO
                </h2>
                
                <div style="background: rgba(0, 255, 136, 0.1); border: 1px solid #00ff88; border-radius: 8px; padding: 15px; margin: 10px 0;">
                    <h3 style="color: #00ff88; margin-bottom: 10px;">TRANSMISSION CONFIRMED</h3>
                    <p>Hello ${name},</p>
                    <p>Your message has been successfully received and processed by the YASH Portfolio System.</p>
                    <p><strong style="color: #00d4ff;">Subject:</strong> ${subject}</p>
                    <p><strong style="color: #00d4ff;">Received:</strong> ${new Date().toLocaleString()}</p>
                </div>
                
                <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid #00d4ff; border-radius: 8px; padding: 15px; margin: 10px 0;">
                    <h3 style="color: #00d4ff; margin-bottom: 10px;">NEXT STEPS:</h3>
                    <p>• Your message is being analyzed by AI systems</p>
                    <p>• Response time: 24-48 hours</p>
                    <p>• Priority level: High</p>
                    <p>• Status: Processing</p>
                </div>
                
                <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #00d4ff;">
                    <p style="color: #00ffff;">Thank you for contacting Yash Agarwal</p>
                    <p style="color: #888888; font-size: 12px;">
                        This is an automated response from the YASH Portfolio System
                    </p>
                </div>
            </div>
        `;
        
        await emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🤖 Message Received - YASH Portfolio System',
            html: confirmationEmail
        });
        
        res.json({
            message: 'Message transmitted successfully! Check your email for confirmation.',
            status: 'success',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        
        let errorMessage = 'Transmission failed. Please try again.';
        
        if (error.code === 'EAUTH') {
            errorMessage = 'Email authentication failed. Please contact administrator.';
        } else if (error.code === 'ENOTFOUND') {
            errorMessage = 'Network error. Please check your connection.';
        }
        
        res.status(500).json({
            message: errorMessage,
            status: 'error'
        });
    }
});

// Test email configuration
router.get('/test-email', authenticateToken, async (req, res) => {
    try {
        await emailTransporter.verify();
        res.json({ message: 'Email configuration is working correctly' });
    } catch (error) {
        console.error('Email test error:', error);
        res.status(500).json({ message: 'Email configuration error', error: error.message });
    }
});

module.exports = router;