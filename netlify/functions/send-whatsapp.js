// Netlify Function to send WhatsApp messages
// This function will be deployed to Netlify and handle form submissions

const https = require('https');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        
        // Validate required fields
        if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Please fill in all required fields.' 
                })
            };
        }

        // Format the message with better structure
        const whatsappMessage = `🔔 *NEW CONTACT INQUIRY*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *CONTACT DETAILS*
• Name: ${data.firstName} ${data.lastName}
• Email: ${data.email}
• Company: ${data.company || 'Not provided'}

📋 *INQUIRY DETAILS*
• Service: ${data.subject}

💬 *MESSAGE:*
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 Sent from Blackwater Industries Contact Form
⏰ ${new Date().toLocaleString('en-US', { 
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
})} ET`;

        // For now, we'll use a simple approach with WhatsApp Web API
        // You can replace this with a proper WhatsApp Business API integration
        const result = await sendWhatsAppMessage(whatsappMessage);
        
        if (result.success) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Message sent successfully to WhatsApp!' 
                })
            };
        } else {
            throw new Error(result.error || 'Failed to send message');
        }

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ 
                success: false, 
                message: 'An error occurred while sending the message. Please try again.' 
            })
        };
    }
};

// Function to send WhatsApp message
// This is a placeholder - you'll need to integrate with a WhatsApp service
async function sendWhatsAppMessage(message) {
    // Option 1: Use Twilio WhatsApp API
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const from = process.env.TWILIO_WHATSAPP_FROM; // Your WhatsApp Business number
    // const to = process.env.WHATSAPP_TO; // Your personal WhatsApp number
    
    // const twilio = require('twilio')(accountSid, authToken);
    
    // try {
    //     await twilio.messages.create({
    //         from: from,
    //         to: to,
    //         body: message
    //     });
    //     return { success: true };
    // } catch (error) {
    //     return { success: false, error: error.message };
    // }

    // Option 2: Use WhatsApp Business API via 360Dialog or similar
    // const apiKey = process.env.WHATSAPP_API_KEY;
    // const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    // const to = process.env.WHATSAPP_TO;
    
    // const response = await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': `Bearer ${apiKey}`,
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         messaging_product: 'whatsapp',
    //         to: to,
    //         type: 'text',
    //         text: { body: message }
    //     })
    // });
    
    // if (response.ok) {
    //     return { success: true };
    // } else {
    //     const error = await response.json();
    //     return { success: false, error: error.error?.message };
    // }

    // For now, return success (you'll need to implement actual WhatsApp integration)
    console.log('WhatsApp message to be sent:', message);
    return { success: true };
}

// Handle preflight requests
exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }
    
    return exports.handler(event, context);
};
