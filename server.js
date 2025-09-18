require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const compression = require('compression');
const path = require('path');
const { db } = require('./supabase');
const { sendWhatsAppNotification } = require('./whatsapp-integration');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to contact form
app.use('/api/contact', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Validation rules
const contactValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name contains invalid characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name contains invalid characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must be less than 100 characters'),
  
  body('subject')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject is required and must be less than 200 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

// Contact form endpoint
app.post('/api/contact', contactValidation, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, company, subject, message } = req.body;

    // Store in database first
    const submissionData = {
      firstName,
      lastName,
      email,
      company,
      subject,
      message,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    const dbResult = await db.storeContactSubmission(submissionData);

    // Create email content
    const emailContent = {
      from: `"${firstName} ${lastName}" <${process.env.SMTP_USER}>`,
      to: process.env.TARGET_EMAIL || 'blackwater.industriespvtltd@gmail.com',
      replyTo: email,
      subject: `Website Inquiry: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px;">
              New Website Inquiry
            </h2>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #555; margin-bottom: 10px;">Contact Information</h3>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
              ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #555; margin-bottom: 10px;">Subject</h3>
              <p style="background-color: #f8f9fa; padding: 10px; border-left: 4px solid #007bff; margin: 0;">
                ${subject}
              </p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #555; margin-bottom: 10px;">Message</h3>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; white-space: pre-wrap; line-height: 1.6;">
                ${message}
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
              <p>This inquiry was submitted through the Blackwater Industries website contact form.</p>
              <p>Submitted on: ${new Date().toLocaleString('en-US', { 
                timeZone: 'America/New_York',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}</p>
            </div>
          </div>
        </div>
      `,
      text: `
        New Website Inquiry
        
        Contact Information:
        Name: ${firstName} ${lastName}
        Email: ${email}
        ${company ? `Company: ${company}` : ''}
        
        Subject: ${subject}
        
        Message:
        ${message}
        
        Submitted on: ${new Date().toLocaleString('en-US', { 
          timeZone: 'America/New_York',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        })}
        
        This inquiry was submitted through the Blackwater Industries website contact form.
      `
    };

    // Send email (optional - don't fail if email is not configured)
    try {
      const transporter = createTransporter();
      await transporter.sendMail(emailContent);
      console.log(`✅ Email sent successfully to ${process.env.TARGET_EMAIL}`);
    } catch (emailError) {
      console.warn('⚠️  Email sending failed (continuing anyway):', emailError.message);
      // Don't fail the entire request if email fails
    }

    // Send WhatsApp notification (optional)
    try {
      const whatsappResult = await sendWhatsAppNotification(submissionData);
      if (whatsappResult.success) {
        console.log('✅ WhatsApp notification sent successfully');
      } else {
        console.warn('⚠️ WhatsApp notification failed:', whatsappResult.error);
      }
    } catch (whatsappError) {
      console.warn('⚠️ WhatsApp notification error:', whatsappError.message);
    }

    // Log successful submission
    console.log(`✅ Contact form submission received from ${firstName} ${lastName} (${email})`);

    res.status(200).json({
      success: true,
      message: 'Your message has been received successfully. We will respond within 1-2 business days.'
    });

  } catch (error) {
    console.error('Error sending contact form:', error);
    
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later or contact us directly.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Admin endpoints for contact submissions
app.get('/api/admin/submissions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const submissions = await db.getContactSubmissions(limit, offset);
    
    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        limit,
        offset,
        hasMore: submissions.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions'
    });
  }
});

app.get('/api/admin/submissions/:id', async (req, res) => {
  try {
    const submission = await db.getContactSubmission(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submission'
    });
  }
});

app.patch('/api/admin/submissions/:id/process', async (req, res) => {
  try {
    const { notes } = req.body;
    const result = await db.markAsProcessed(req.params.id, notes);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'Submission marked as processed'
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating submission'
    });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

// Serve the main HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Blackwater Industries backend server running on port ${PORT}`);
  console.log(`📧 Email forwarding configured for: ${process.env.TARGET_EMAIL || 'blackwater.industriespvtltd@gmail.com'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
