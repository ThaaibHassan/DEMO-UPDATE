# 📱 WhatsApp Integration Setup Guide

## 🎯 **3 Options for WhatsApp Notifications**

### **Option 1: Twilio WhatsApp API (Recommended - Easiest)**

**Pros:** Easy setup, reliable, professional
**Cost:** ~$0.005 per message

#### Setup Steps:
1. **Sign up for Twilio**: https://www.twilio.com/try-twilio
2. **Get WhatsApp Sandbox**:
   - Go to Console → Develop → Messaging → Try it out → Send a WhatsApp message
   - Follow instructions to connect your WhatsApp number
3. **Get Credentials**:
   - Account SID
   - Auth Token
   - WhatsApp Sandbox Number (e.g., +14155238886)

#### Environment Variables:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
WHATSAPP_TARGET_NUMBER=+1234567890
```

---

### **Option 2: WhatsApp Business API (Most Professional)**

**Pros:** Official API, unlimited messages, business features
**Cost:** Free for first 1,000 messages/month

#### Setup Steps:
1. **Create Meta Developer Account**: https://developers.facebook.com
2. **Create WhatsApp Business App**
3. **Get Phone Number ID and Access Token**
4. **Verify your business**

#### Environment Variables:
```env
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_TARGET_NUMBER=+1234567890
```

---

### **Option 3: WhatsApp Web (Development Only)**

**Pros:** Free, easy for testing
**Cons:** Not reliable for production, may break

#### Setup Steps:
1. **Install whatsapp-web.js**:
   ```bash
   npm install whatsapp-web.js
   ```
2. **Scan QR code** with your phone
3. **Use for development/testing only**

---

## 🚀 **Quick Setup with Twilio (Recommended)**

### **Step 1: Twilio Account Setup**
1. Go to https://www.twilio.com/try-twilio
2. Sign up for free account
3. Verify your phone number

### **Step 2: WhatsApp Sandbox**
1. In Twilio Console, go to **Develop** → **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow the instructions to connect your WhatsApp
3. Send "join <sandbox-code>" to the Twilio number

### **Step 3: Get Credentials**
1. **Account SID**: Found in Twilio Console dashboard
2. **Auth Token**: Found in Twilio Console dashboard
3. **WhatsApp Number**: The sandbox number (e.g., +14155238886)

### **Step 4: Add to Railway**
In your Railway project → **Variables** tab, add:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
WHATSAPP_TARGET_NUMBER=+1234567890
```

### **Step 5: Deploy**
The WhatsApp integration will automatically work once you add the environment variables!

---

## 📱 **Message Format**

When someone submits the contact form, you'll receive a WhatsApp message like:

```
🚨 New Contact Form Submission

👤 Name: John Doe
📧 Email: john@example.com
🏢 Company: Acme Corp
📋 Subject: Consultation Request

💬 Message:
I would like to discuss our strategic planning needs...

⏰ Submitted: 9/18/2025, 2:30:45 PM
🌐 Source: Blackwater Industries Website
```

---

## 🔧 **Testing**

1. **Add environment variables** to Railway
2. **Deploy the updated code**
3. **Submit a test contact form**
4. **Check your WhatsApp** for the notification

---

## 💡 **Pro Tips**

- **Twilio Sandbox**: Perfect for testing, limited to verified numbers
- **Production**: Upgrade to full WhatsApp Business API for unlimited messages
- **Backup**: Email notifications still work as backup
- **Privacy**: Only send notifications to your business number

---

## 🆘 **Troubleshooting**

### **"WhatsApp notification failed"**
- Check environment variables are set correctly
- Verify Twilio credentials
- Ensure target number is in correct format (+1234567890)

### **"Sandbox not working"**
- Make sure you sent "join <code>" to Twilio number
- Check if your number is verified in Twilio
- Try re-connecting to sandbox

### **"Message not received"**
- Check phone number format
- Verify WhatsApp is installed on target device
- Check Twilio logs for errors

---

**Ready to set up WhatsApp notifications?** Start with Twilio - it's the easiest option! 🚀
