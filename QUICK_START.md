# 🚀 FilaYA - Quick Start Guide

Get FilaYA running with Supabase in 10 minutes!

## ⚡ Quick Setup (5 minutes)

### 1. Run the Setup Script
```bash
npm run setup
```

### 2. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name: `filaya-production`
4. Password: Generate strong password (save it!)
5. Region: `us-east-1` (closest to Argentina)
6. Click "Create new project"
7. Wait 2-3 minutes

### 3. Get Your Credentials
1. Go to **Settings > API** in Supabase
2. Copy these 3 values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

### 4. Configure Environment
```bash
# Edit .env.local with your credentials
nano .env.local
```

Replace these values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
SUPABASE_SERVICE_ROLE=your-actual-service-role-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

### 5. Set Up Database
1. Go to **SQL Editor** in Supabase
2. Click **"New Query"**
3. Copy the entire content from `supabase/001_schema.sql`
4. Paste and click **"Run"**
5. Create another query with `supabase/002_seed.sql`
6. Paste and click **"Run"**

### 6. Test Connection
```bash
npm run test:connection
```

### 7. Start the App
```bash
npm run dev
```

### 8. Open in Browser
- **Homepage**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Join Page**: http://localhost:3000/join/kansas-belgrano
- **Status Page**: http://localhost:3000/status/demo-token-1

## ✅ Verify Everything Works

### Test 1: Homepage
- Should see "FilaYA" with blue gradient
- Two cards: "Para Restaurantes" and "Para Clientes"

### Test 2: Dashboard
- Should see "Kansas Belgrano" header
- Stats cards showing numbers
- QR code section
- Party list (may be empty initially)

### Test 3: Join Page
- Should see form with name, phone, size fields
- "Verificar" button for phone
- Submit button

### Test 4: Status Page
- Should see party information
- Position in queue
- Action buttons

## 🔧 Troubleshooting

### "Invalid API key" error
- Check `.env.local` has correct Supabase URL and keys
- Restart dev server: `npm run dev`

### "Table doesn't exist" error
- Run the SQL schema again in Supabase
- Check Table Editor shows all tables

### "RLS policy" error
- Make sure you ran both SQL files
- Check Authentication > Policies in Supabase

### Connection test fails
```bash
# Check if environment variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

## 🎯 Next Steps

1. **Add Real Data**: Use the dashboard to add parties
2. **Test Notifications**: Set up WhatsApp/SMS (optional)
3. **Customize**: Modify restaurant name, colors, etc.
4. **Deploy**: Push to GitHub and deploy to Vercel

## 📱 Mobile Testing

1. Open Chrome DevTools (F12)
2. Click device icon (phone/tablet)
3. Select iPhone or Android
4. Test all pages on mobile

## 🆘 Need Help?

- **Full Guide**: See `SETUP_GUIDE.md`
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Issues**: Create GitHub issue

---

**🎉 You're done!** FilaYA should now be fully functional with Supabase.
