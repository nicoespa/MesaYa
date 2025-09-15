# 🎯 FilaYA - Complete Step-by-Step Setup

Follow these exact steps to get FilaYA working with Supabase.

## 📋 What You Need
- Computer with Node.js 18+
- Internet connection
- 15 minutes of time

## 🚀 Step 1: Verify Setup (1 minute)

Your project is already set up! Let's verify:

```bash
# Check if everything is ready
ls -la
```

You should see:
- ✅ `package.json` - Dependencies configured
- ✅ `app/` - Next.js pages
- ✅ `supabase/` - Database files
- ✅ `.env.local` - Environment template

## 🗄️ Step 2: Create Supabase Project (3 minutes)

### 2.1 Go to Supabase
1. Open [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub/Google/Email

### 2.2 Create New Project
1. Click **"New Project"**
2. Fill in:
   - **Name**: `filaya-production`
   - **Database Password**: Generate strong password (SAVE THIS!)
   - **Region**: `us-east-1` (closest to Argentina)
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup

### 2.3 Get Your Keys
1. Go to **Settings** (gear icon) → **API**
2. Copy these 3 values:
   ```
   Project URL: https://abcdefgh.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## ⚙️ Step 3: Configure Environment (2 minutes)

### 3.1 Edit .env.local
```bash
# Open the file in your editor
nano .env.local
# or
code .env.local
```

### 3.2 Replace the placeholder values
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

## 🗄️ Step 4: Set Up Database (3 minutes)

### 4.1 Go to SQL Editor
1. In Supabase dashboard, click **"SQL Editor"**
2. Click **"New Query"**

### 4.2 Run Schema
1. Open `supabase/001_schema.sql` in your editor
2. Copy ALL the content
3. Paste into Supabase SQL Editor
4. Click **"Run"**
5. Should see "Success. No rows returned"

### 4.3 Add Sample Data
1. Create another query in SQL Editor
2. Open `supabase/002_seed.sql`
3. Copy ALL the content
4. Paste into Supabase SQL Editor
5. Click **"Run"**
6. Should see "Success. No rows returned"

## ✅ Step 5: Test Connection (1 minute)

```bash
# Test if Supabase is connected
npm run test:connection
```

Should see:
```
✅ Supabase connection successful!
✅ Sample data found
   Restaurant: Kansas Belgrano
```

## 🚀 Step 6: Start the Application (1 minute)

```bash
# Start the development server
npm run dev
```

Should see:
```
✓ Ready in 2.1s
- Local: http://localhost:3000
```

## 🌐 Step 7: Test the Application (3 minutes)

### 7.1 Test Homepage
- Open http://localhost:3000
- Should see "FilaYA" with blue gradient
- Two cards: "Para Restaurantes" and "Para Clientes"

### 7.2 Test Dashboard
- Click "Acceder al Dashboard" or go to http://localhost:3000/dashboard
- Should see "Kansas Belgrano" header
- Stats cards with numbers
- QR code section
- Party list (should show sample data)

### 7.3 Test Join Page
- Go to http://localhost:3000/join/kansas-belgrano
- Should see form with name, phone, size fields
- Try filling it out and submitting

### 7.4 Test Status Page
- Go to http://localhost:3000/status/demo-token-1
- Should see party information
- Position in queue
- Action buttons

## 🎉 Step 8: You're Done! (1 minute)

FilaYA is now fully functional! You can:

1. **Add parties** via the dashboard
2. **Test the join flow** with QR codes
3. **See real-time updates** in the dashboard
4. **Test on mobile** using Chrome DevTools

## 🔧 Troubleshooting

### "Invalid API key" error
```bash
# Check your .env.local file
cat .env.local | grep SUPABASE
```

### "Table doesn't exist" error
- Go back to Supabase SQL Editor
- Run the schema SQL again

### "Connection failed" error
```bash
# Test connection
npm run test:connection
```

### App won't start
```bash
# Check for errors
npm run dev
```

## 📱 Mobile Testing

1. Open Chrome DevTools (F12)
2. Click device icon (📱)
3. Select iPhone or Android
4. Test all pages

## 🚀 Next Steps

1. **Customize**: Change restaurant name, colors
2. **Add Real Data**: Use the dashboard
3. **Set Up Notifications**: Configure WhatsApp/SMS
4. **Deploy**: Push to GitHub and deploy to Vercel

---

**🎯 Congratulations!** FilaYA is now running with Supabase integration.
