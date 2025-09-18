# 🚀 Railway Deployment Steps

## Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: `blackwater-industries-backend`
3. **Description**: `Professional backend for Blackwater Industries contact form with email forwarding`
4. **Make it Public** (for free Railway deployment)
5. **Click "Create repository"**

## Step 2: Push to GitHub

Run these commands in your terminal:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/blackwater-industries-backend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy on Railway

1. **Go to Railway**: https://railway.app
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**: `blackwater-industries-backend`
6. **Railway will auto-detect Node.js and deploy!**

## Step 4: Configure Environment Variables

In Railway dashboard, go to your project → **Variables** tab and add:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=blackwater.industriespvtltd@gmail.com
SMTP_PASS=pdfy bivv rikm bqtn
TARGET_EMAIL=blackwater.industriespvtltd@gmail.com
SUPABASE_URL=https://vcofqrkediznsuhtbapp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjb2ZxcmtlZGl6bnN1aHRiYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxODI3MjMsImV4cCI6MjA3Mzc1ODcyM30.1CHrStZ-mNzC139_pGrFLuhul_iiePwUQ5MXfBabxlE
NODE_ENV=production
PORT=3000
```

## Step 5: Get Your Live URL

Railway will provide a URL like: `https://your-app-name.railway.app`

## Step 6: Test Your Live Site

- **Contact Form**: `https://your-app-name.railway.app/contact`
- **Admin Dashboard**: `https://your-app-name.railway.app/admin`
- **API Health**: `https://your-app-name.railway.app/api/health`

## 🎉 You're Live!

Your Blackwater Industries backend is now deployed and ready to handle contact form submissions with email forwarding!

---

**Need Help?** Check the Railway documentation: https://docs.railway.app
