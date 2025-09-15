# 🚀 FilaYA - Complete Supabase Setup Guide

This guide will walk you through setting up FilaYA with Supabase to make it fully functional, dynamic, and professional.

## 📋 What You'll Get

After completing this setup, you'll have:
- ✅ **Real-time data updates** using Supabase subscriptions
- ✅ **Professional UI** with loading states and error handling
- ✅ **Complete API** with proper validation and error handling
- ✅ **Authentication system** ready for production
- ✅ **Dynamic dashboard** that updates in real-time
- ✅ **Mobile-responsive** PWA application

## 🎯 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- 15-20 minutes of time

## 🚀 Step 1: Create Supabase Project (5 minutes)

### 1.1 Create Account & Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub/Google/Email
3. Click **"New Project"**
4. Fill in:
   - **Name**: `filaya-production`
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: `us-east-1` (closest to Argentina)
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup

### 1.2 Get Your Credentials
1. Go to **Settings** (gear icon) → **API**
2. Copy these 3 values:
   ```
   Project URL: https://your-project-id.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## ⚙️ Step 2: Configure Environment Variables (2 minutes)

1. **Create `.env.local` file**:
   ```bash
   cp env.local.example .env.local
   ```

2. **Edit `.env.local`** with your actual Supabase credentials:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
   SUPABASE_SERVICE_ROLE=your-actual-service-role-key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key

   # Leave the rest as is for now
   WHATSAPP_BASE_URL=https://graph.facebook.com/v21.0
   WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
   WHATSAPP_ACCESS_TOKEN=your-access-token
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_FROM_NUMBER=your-from-number
   APP_TZ=America/Argentina/Buenos_Aires
   SENTRY_DSN=your-sentry-dsn
   ```

## 🗄️ Step 3: Set Up Database Schema (3 minutes)

### 3.1 Run the Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Click **"New Query"**
3. Copy the entire content from `supabase/001_schema.sql`
4. Paste into Supabase SQL Editor
5. Click **"Run"**
6. Should see "Success. No rows returned"

### 3.2 Add Sample Data
1. Create another query in SQL Editor
2. Copy the entire content from `supabase/002_seed.sql`
3. Paste into Supabase SQL Editor
4. Click **"Run"**
5. Should see "Success. No rows returned"

## 🧪 Step 4: Test Your Setup (2 minutes)

Run the test script to verify everything is working:

```bash
node scripts/test-setup.js
```

You should see:
```
✅ Environment variables configured
✅ Supabase connection successful
✅ All required tables exist
✅ API endpoints working
🎉 Setup test completed!
```

## 🚀 Step 5: Start the Application (1 minute)

```bash
# Install dependencies (if not done)
npm install

# Start the development server
npm run dev
```

Should see:
```
✓ Ready in 2.1s
- Local: http://localhost:3000
```

## 🌐 Step 6: Test the Application (5 minutes)

### 6.1 Test Homepage
- Open http://localhost:3000
- Should see "FilaYA" with blue gradient
- Two cards: "Para Restaurantes" and "Para Clientes"

### 6.2 Test Dashboard
- Go to http://localhost:3000/dashboard
- Should see "Kansas Belgrano" header
- Stats cards with real-time data
- QR code section
- Party list (should show sample data)
- **Real-time updates**: Open in two browser tabs and see changes sync

### 6.3 Test Party Management
- Click "Agregar Fila" to add a new party
- Try the party actions: Notificar, En Camino, Sentar, No Show
- **Notice**: Loading states and real-time updates

### 6.4 Test Join Page
- Go to http://localhost:3000/join/kansas-belgrano
- Should see form with name, phone, size fields
- Try filling it out and submitting

### 6.5 Test Status Page
- Go to http://localhost:3000/status/demo-token-1
- Should see party information
- Position in queue
- Action buttons

## 🎉 Step 7: You're Done! (1 minute)

FilaYA is now fully functional with:
- ✅ **Real-time data updates** - Changes sync across all clients
- ✅ **Professional UI** - Loading states, error handling, responsive design
- ✅ **Complete API** - All party actions working with proper validation
- ✅ **Authentication ready** - Login system ready for production
- ✅ **Mobile PWA** - Works on mobile devices as an app

## 🔧 Advanced Features

### Real-Time Updates
The application now uses Supabase subscriptions for real-time updates:
- Party list updates automatically
- Stats refresh in real-time
- Multiple users see changes instantly

### Professional UI
Enhanced with:
- Loading states for all actions
- Error handling with retry options
- Toast notifications
- Responsive design
- Professional animations

### Complete API
All endpoints include:
- Input validation
- Error handling
- Database transactions
- Metrics tracking

## 🚨 Troubleshooting

### Common Issues:

**1. "Invalid API key" error**
```bash
# Check your .env.local file
cat .env.local | grep SUPABASE
```

**2. "Table doesn't exist" error**
- Go back to Supabase SQL Editor
- Run the schema SQL again

**3. "Connection failed" error**
```bash
# Test connection
node scripts/test-setup.js
```

**4. Real-time not working**
- Check Supabase project is not paused
- Verify RLS policies are correct
- Check browser console for errors

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

## 📱 Mobile Testing

1. Open Chrome DevTools (F12)
2. Click device icon (📱)
3. Select iPhone or Android
4. Test all pages
5. Install as PWA (Add to Home Screen)

## 🚀 Next Steps

1. **Customize**: Change restaurant name, colors, branding
2. **Add Real Data**: Use the dashboard to manage real parties
3. **Set Up Notifications**: Configure WhatsApp/SMS for production
4. **Deploy**: Push to GitHub and deploy to Vercel
5. **Add Authentication**: Set up user accounts for production

## 🆘 Need Help?

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **FilaYA Issues**: Create an issue in this repository

---

**🎯 Congratulations!** FilaYA is now fully functional with Supabase integration, real-time updates, and professional UI. Your restaurant waitlist management system is ready to use!
