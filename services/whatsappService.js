const axios = require('axios');

class WhatsAppService {
    constructor() {
        this.apiUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/send';
        this.phoneNumber = process.env.WHATSAPP_PHONE_NUMBER; // Your WhatsApp number
    }

    async sendContactMessage(contactData) {
        const { name, email, subject, message } = contactData;
        
        const formattedMessage = `
📧 *New Contact Form Submission*

👤 *Name:* ${name}
📧 *Email:* ${email}
📋 *Subject:* ${subject}
💬 *Message:* ${message}
⏰ *Timestamp:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        `.trim();

        try {
            // Using WhatsApp Cloud API (Meta Business API)
            if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_ID) {
                return await this.sendViaCloudAPI(formattedMessage);
            } 
            // Using WhatsApp Web API (for testing)
            else {
                return await this.sendViaWebAPI(formattedMessage);
            }
        } catch (error) {
            console.error('WhatsApp sending failed:', error);
            throw new Error('Failed to send WhatsApp notification');
        }
    }

    async sendViaCloudAPI(message) {
        const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
        
        const payload = {
            messaging_product: "whatsapp",
            to: process.env.WHATSAPP_PHONE_NUMBER,
            type: "text",
            text: {
                body: message
            }
        };

        const headers = {
            'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.post(url, payload, { headers });
        return { success: true, messageId: response.data.messages[0].id };
    }

    async sendViaWebAPI(message) {
        // This is a placeholder for WhatsApp Web integration
        // In production, you'd use a proper WhatsApp Business API
        console.log('📱 WhatsApp message prepared:', message);
        
        // For now, we'll simulate success
        return { 
            success: true, 
            message: 'WhatsApp message prepared (API integration required)',
            note: 'Configure WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_ID for real integration'
        };
    }
}

module.exports = WhatsAppService;
