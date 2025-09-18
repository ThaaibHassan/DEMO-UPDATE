# Deployment Guide for Blackwater Industries Backend

## 🚨 Important: Netlify Limitation

**Netlify only hosts static websites** and cannot run Node.js backends. Your contact form backend requires a server platform.

## 🎯 Recommended Deployment Options

### Option 1: Railway (Recommended - Easy & Free)
1. **Sign up**: https://railway.app
2. **Connect GitHub**: Link your repository
3. **Deploy**: Railway auto-detects Node.js and deploys
4. **Environment Variables**: Add your `.env` variables in Railway dashboard
5. **Custom Domain**: Add your domain in Railway settings

### Option 2: Render (Free Tier Available)
1. **Sign up**: https://render.com
2. **New Web Service**: Connect your GitHub repo
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**: Add from your `.env` file

### Option 3: Heroku (Paid)
1. **Sign up**: https://heroku.com
2. **Create App**: New Heroku app
3. **Connect GitHub**: Link repository
4. **Config Vars**: Add environment variables
5. **Deploy**: Enable automatic deploys

### Option 4: Vercel (For Full-Stack)
1. **Sign up**: https://vercel.com
2. **Import Project**: Connect GitHub repo
3. **Framework**: Select "Other" for Node.js
4. **Environment Variables**: Add from `.env`
5. **Deploy**: Automatic deployment

## 📁 For Static Frontend Only (Netlify)

If you want to deploy just the frontend to Netlify:

1. **Remove backend files**:
   - `server.js`
   - `package.json`
   - `node_modules/`
   - `.env`

2. **Update contact form** to use a service like:
   - Formspree
   - Netlify Forms
   - EmailJS

3. **Deploy to Netlify**:
   - Drag & drop your folder
   - Or connect GitHub repository

## 🔧 Environment Variables for Production

Make sure to set these in your deployment platform:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=blackwater.industriespvtltd@gmail.com
SMTP_PASS=your-app-password

# Target Email
TARGET_EMAIL=blackwater.industriespvtltd@gmail.com

# Supabase (Optional)
SUPABASE_URL=https://vcofqrkediznsuhtbapp.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Server Configuration
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

## 🚀 Quick Railway Deployment

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Railway**:
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Add environment variables
   - Deploy!

3. **Get your URL**: Railway provides a URL like `https://your-app.railway.app`

## 📝 Post-Deployment Checklist

- [ ] Test contact form on live URL
- [ ] Verify emails are being sent
- [ ] Check admin dashboard works
- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificate
- [ ] Set up monitoring/logs

## 🔒 Security Notes

- Never commit `.env` files to Git
- Use environment variables in production
- Enable HTTPS/SSL
- Set up proper CORS origins
- Monitor for security updates

---

**Recommendation**: Use **Railway** for the easiest deployment with your current setup!
