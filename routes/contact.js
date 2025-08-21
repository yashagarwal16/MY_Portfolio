const express = require('express');
const router = express.Router();
const EmailService = require('../services/emailService');
const WhatsAppService = require('../services/whatsappService');

const emailService = new EmailService();
const whatsappService = new WhatsAppService();

// POST /api/contact/submit
router.post('/submit', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Sanitize input
        const sanitizedData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim()
        };

        // Log the submission
        console.log('📧 New contact form submission:');
        console.log(`Name: ${sanitizedData.name}`);
        console.log(`Email: ${sanitizedData.email}`);
        console.log(`Subject: ${sanitizedData.subject}`);
        console.log(`Message: ${sanitizedData.message}`);
        console.log(`Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);

        // Send email notification
        let emailResult = null;
        try {
            emailResult = await emailService.sendContactEmail(sanitizedData);
            console.log('✅ Email sent successfully:', emailResult.messageId);
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError.message);
        }

        // Send WhatsApp notification
        let whatsappResult = null;
        try {
            whatsappResult = await whatsappService.sendContactMessage(sanitizedData);
            console.log('✅ WhatsApp message sent successfully');
        } catch (whatsappError) {
            console.error('❌ WhatsApp sending failed:', whatsappError.message);
        }

        // Send auto-reply to sender
        let autoReplyResult = null;
        try {
            autoReplyResult = await emailService.sendAutoReply(sanitizedData);
            console.log('✅ Auto-reply sent successfully:', autoReplyResult.messageId);
        } catch (autoReplyError) {
            console.error('❌ Auto-reply sending failed:', autoReplyError.message);
        }

        // Return success response
        res.json({
            success: true,
            message: 'Message transmitted successfully! I will get back to you soon.',
            timestamp: new Date().toISOString(),
            notifications: {
                email: emailResult ? 'sent' : 'failed',
                whatsapp: whatsappResult ? 'sent' : 'failed',
                autoReply: autoReplyResult ? 'sent' : 'failed'
            }
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Transmission failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/contact/test - Test endpoint
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Contact API is working',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
