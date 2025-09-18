# Blackwater Industries - Contact Form Backend

A professional backend service for handling contact form submissions and forwarding them to the Blackwater Industries email address.

## Features

- ✅ **Secure Contact Form Handling** - Validates and processes contact form submissions
- ✅ **Email Forwarding** - Automatically forwards inquiries to `blackwater.industriespvtltd@gmail.com`
- ✅ **Database Storage** - Supabase integration for storing and managing submissions
- ✅ **Admin Dashboard** - Web interface for managing contact form submissions
- ✅ **Rate Limiting** - Prevents spam and abuse with configurable rate limits
- ✅ **Input Validation** - Comprehensive server-side validation for all form fields
- ✅ **Security Headers** - Helmet.js for security best practices
- ✅ **Professional Email Templates** - HTML and text email templates with proper formatting
- ✅ **Error Handling** - Graceful error handling with user-friendly messages
- ✅ **CORS Support** - Configurable CORS for cross-origin requests
- ✅ **Health Check** - API health monitoring endpoint

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your email configuration:

```env
# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Target Email (where inquiries will be forwarded)
TARGET_EMAIL=blackwater.industriespvtltd@gmail.com

# Server Configuration
PORT=3000
NODE_ENV=development

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

### 3. Supabase Setup (Optional - for Database Storage)

For database storage of contact submissions:

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up the Database**:
   - Go to SQL Editor in your Supabase dashboard
   - Run the SQL from `supabase-schema.sql` file
   - This creates the `contact_submissions` table and related functions

3. **Configure Environment Variables**:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

### 4. Gmail Setup (Recommended)

For Gmail SMTP, you'll need to:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `SMTP_PASS`

### 5. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## Admin Dashboard

Access the admin dashboard at `http://localhost:3000/admin` to:

- View all contact form submissions
- See submission statistics (total, pending, processed)
- Mark submissions as processed
- Track submission history

**Note**: The admin dashboard requires Supabase to be configured for full functionality.

## API Endpoints

### POST /api/contact

Submit a contact form inquiry.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "company": "Acme Corp",
  "subject": "Consultation Request",
  "message": "I would like to discuss..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your message has been sent successfully. We will respond within 1-2 business days."
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-27T10:30:00.000Z",
  "uptime": 3600
}
```

## Security Features

- **Rate Limiting**: 5 requests per 15 minutes per IP (configurable)
- **Input Validation**: Server-side validation for all form fields
- **Security Headers**: Helmet.js for security best practices
- **CORS Protection**: Configurable cross-origin request handling
- **Error Handling**: No sensitive information leaked in error responses

## Email Configuration

The system supports any SMTP provider. Common configurations:

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Custom SMTP
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
```

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
```

### PM2 (Recommended for Production)

```bash
npm install -g pm2
pm2 start server.js --name "blackwater-backend"
pm2 startup
pm2 save
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Frontend Integration

The contact form has been updated to use the new backend API. The form now:

- Submits via AJAX to `/api/contact`
- Shows loading states during submission
- Displays success/error messages
- Validates input client-side and server-side
- Prevents duplicate submissions

## Monitoring

- Health check endpoint: `GET /api/health`
- Server logs include successful form submissions
- Error logs for debugging issues

## Troubleshooting

### Common Issues

1. **Email not sending**: Check SMTP credentials and app password
2. **CORS errors**: Verify `CORS_ORIGIN` matches your frontend domain
3. **Rate limiting**: Adjust `RATE_LIMIT_MAX_REQUESTS` if needed
4. **Port conflicts**: Change `PORT` in environment variables

### Logs

Check server logs for detailed error information:
```bash
# Development
npm run dev

# Production with PM2
pm2 logs blackwater-backend
```

## Support

For technical support or questions about this backend implementation, please contact the development team.

---

**Blackwater Industries** - Where Intelligence Meets Execution
