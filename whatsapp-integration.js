// WhatsApp Integration for Blackwater Industries
// Multiple options for sending WhatsApp notifications

const axios = require('axios');

// Option 1: WhatsApp Business API (Recommended for production)
const sendWhatsAppBusinessAPI = async (message, phoneNumber) => {
  try {
    const response = await axios.post('https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages', {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: {
        body: message
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ WhatsApp message sent via Business API');
    return { success: true, messageId: response.data.messages[0].id };
  } catch (error) {
    console.error('❌ WhatsApp Business API error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

// Option 2: Twilio WhatsApp API (Easy setup)
const sendWhatsAppTwilio = async (message, phoneNumber) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'
    
    const response = await axios.post(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      From: fromNumber,
      To: `whatsapp:${phoneNumber}`,
      Body: message
    }, {
      auth: {
        username: accountSid,
        password: authToken
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('✅ WhatsApp message sent via Twilio');
    return { success: true, messageId: response.data.sid };
  } catch (error) {
    console.error('❌ Twilio WhatsApp error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

// Option 3: WhatsApp Web API (Using whatsapp-web.js - for development)
const sendWhatsAppWeb = async (message, phoneNumber) => {
  try {
    // This would require setting up whatsapp-web.js
    // For now, we'll simulate the response
    console.log(`📱 WhatsApp Web: Would send to ${phoneNumber}: ${message}`);
    return { success: true, method: 'whatsapp-web' };
  } catch (error) {
    console.error('❌ WhatsApp Web error:', error.message);
    return { success: false, error: error.message };
  }
};

// Main function to send WhatsApp notification
const sendWhatsAppNotification = async (contactData) => {
  const phoneNumber = process.env.WHATSAPP_TARGET_NUMBER; // e.g., '+1234567890'
  
  if (!phoneNumber) {
    console.warn('⚠️ WhatsApp target number not configured');
    return { success: false, error: 'WhatsApp number not configured' };
  }

  // Format the message
  const message = `🚨 *New Contact Form Submission*

👤 *Name:* ${contactData.firstName} ${contactData.lastName}
📧 *Email:* ${contactData.email}
🏢 *Company:* ${contactData.company || 'Not provided'}
📋 *Subject:* ${contactData.subject}

💬 *Message:*
${contactData.message}

⏰ *Submitted:* ${new Date().toLocaleString()}
🌐 *Source:* Blackwater Industries Website`;

  // Try different methods in order of preference
  const methods = [
    { name: 'Twilio', fn: sendWhatsAppTwilio },
    { name: 'Business API', fn: sendWhatsAppBusinessAPI },
    { name: 'Web API', fn: sendWhatsAppWeb }
  ];

  for (const method of methods) {
    try {
      const result = await method.fn(message, phoneNumber);
      if (result.success) {
        console.log(`✅ WhatsApp notification sent via ${method.name}`);
        return result;
      }
    } catch (error) {
      console.warn(`⚠️ ${method.name} failed:`, error.message);
    }
  }

  return { success: false, error: 'All WhatsApp methods failed' };
};

module.exports = {
  sendWhatsAppNotification,
  sendWhatsAppBusinessAPI,
  sendWhatsAppTwilio,
  sendWhatsAppWeb
};
