# 🚀 FilaYA - Complete Supabase Setup Guide

This guide will walk you through setting up FilaYA with Supabase to make it fully functional.

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Basic understanding of databases

## 🎯 Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with your GitHub, Google, or email
3. **Click "New Project"**
4. **Fill in project details:**
   - Organization: Create new or select existing
   - Project name: `filaya-production`
   - Database password: Generate a strong password (save it!)
   - Region: Choose closest to Argentina (e.g., `us-east-1`)
5. **Click "Create new project"**
6. **Wait 2-3 minutes** for the project to be ready

## 🔑 Step 2: Get Supabase Credentials

1. **Go to Project Settings** (gear icon in sidebar)
2. **Click "API"** in the left menu
3. **Copy these values:**
   - `Project URL` (looks like: `https://abcdefgh.supabase.co`)
   - `anon public` key (starts with `eyJ...`)
   - `service_role` key (starts with `eyJ...`)

## 🗄️ Step 3: Set Up Database Schema

1. **Go to SQL Editor** in your Supabase dashboard
2. **Click "New Query"**
3. **Copy and paste** the entire content of `supabase/001_schema.sql`
4. **Click "Run"** to execute the schema
5. **Verify success** - you should see "Success. No rows returned"

## 🌱 Step 4: Add Sample Data

1. **In the same SQL Editor**
2. **Create a new query**
3. **Copy and paste** the entire content of `supabase/002_seed.sql`
4. **Click "Run"** to add sample data
5. **Verify** - you should see "Success. No rows returned"

## ⚙️ Step 5: Configure Environment Variables

1. **In your FilaYA project root**, create `.env.local`:
```bash
cp env.local.example .env.local
```

2. **Edit `.env.local`** with your Supabase credentials:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE=your-service-role-key-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# WhatsApp Cloud API (optional - for production)
WHATSAPP_BASE_URL=https://graph.facebook.com/v21.0
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-access-token

# Twilio SMS (optional - for production)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM_NUMBER=your-from-number

# Timezone
APP_TZ=America/Argentina/Buenos_Aires

# Sentry (optional)
SENTRY_DSN=your-sentry-dsn
```

## 🔐 Step 6: Configure Row Level Security (RLS)

1. **Go to Authentication > Policies** in Supabase
2. **Verify RLS is enabled** for all tables
3. **Test the policies** by going to Table Editor and checking if you can see data

## 🚀 Step 7: Start the Application

1. **Install dependencies** (if not done):
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Open your browser** to `http://localhost:3000`

## ✅ Step 8: Test the Application

### Test 1: Homepage
- Visit `http://localhost:3000`
- Should see "FilaYA" with restaurant and client sections

### Test 2: Dashboard
- Visit `http://localhost:3000/dashboard`
- Should see the operator dashboard with sample data
- Should see stats cards and party list

### Test 3: Join Page
- Visit `http://localhost:3000/join/kansas-belgrano`
- Should see the self-check-in form
- Try filling it out and submitting

### Test 4: Status Page
- Visit `http://localhost:3000/status/demo-token-1`
- Should see the PWA status page with party information

## 🔧 Step 9: Configure Authentication (Optional)

For production, you'll want to set up proper authentication:

1. **Go to Authentication > Settings** in Supabase
2. **Configure providers** (Email, Google, etc.)
3. **Set up redirect URLs**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

## 📱 Step 10: Test PWA Features

1. **Open Chrome DevTools** (F12)
2. **Go to Application tab**
3. **Check Manifest** - should show PWA details
4. **Test Service Worker** - should be registered
5. **Test on mobile** - use Chrome's device emulation

## 🚨 Troubleshooting

### Common Issues:

**1. "Invalid API key" error**
- Check your `.env.local` file
- Ensure no extra spaces in the keys
- Restart the dev server after changes

**2. "RLS policy" errors**
- Make sure you ran the schema SQL
- Check that RLS is enabled on tables
- Verify the policies were created

**3. "Table doesn't exist" errors**
- Run the schema SQL again
- Check the Table Editor in Supabase
- Ensure all tables were created

**4. CORS errors**
- Check your Supabase project URL
- Ensure it's the correct project
- Check if the project is paused (free tier)

### Debug Steps:

1. **Check Supabase logs**:
   - Go to Logs in Supabase dashboard
   - Look for any error messages

2. **Check browser console**:
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

3. **Verify environment variables**:
```bash
# In your terminal, check if variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

## 🎉 Step 11: Production Deployment

### Deploy to Vercel:

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial FilaYA setup"
git remote add origin https://github.com/yourusername/filaya.git
git push -u origin main
```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Update Supabase settings**:
   - Add your Vercel domain to allowed origins
   - Update redirect URLs for production

## 📊 Step 12: Monitor and Maintain

1. **Check Supabase dashboard** regularly
2. **Monitor usage** in the free tier
3. **Set up alerts** for errors
4. **Backup data** regularly

## 🆘 Need Help?

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **FilaYA Issues**: Create an issue in this repository

---

**🎯 You're all set!** FilaYA should now be fully functional with Supabase integration.
