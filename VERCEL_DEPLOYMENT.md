# Deploy to Vercel - Quick Guide

Your Resume Enhancer is ready to deploy! Everything is pushed to GitHub.

## 📦 Repository Details

- **GitHub**: https://github.com/GustheTrader/Resume-enhancer
- **Branch**: `claude/review-and-vercel-deploy-011CUmvr5VnH4tGu5az1HmJh`
- **Status**: All changes committed and pushed ✅

---

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1: Go to Vercel

Visit: https://vercel.com

Sign in with your GitHub account

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find **"GustheTrader/Resume-enhancer"** in the list
4. Click **"Import"**

### Step 3: Configure Project

**Framework Preset**: Next.js (should auto-detect)

**Branch**: Select `claude/review-and-vercel-deploy-011CUmvr5VnH4tGu5az1HmJh`

**Build Settings**: Leave as default

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add these one by one:

#### Required Variables:

```
DATABASE_URL
postgresql://postgres:Wg5hDii2ZKYOQfNy@db.rsaybetloqjuzsqjwpmz.supabase.co:5432/postgres
```

```
NEXTAUTH_SECRET
JzmuN+yrszyonOp4VI2IpgL6JNGI514zPf+HL4KXaZY=
```

```
NEXTAUTH_URL
https://your-app-name.vercel.app
```
⚠️ **Important**: You'll update this after deployment with your actual Vercel URL

```
NEXT_PUBLIC_SUPABASE_URL
https://rsaybetloqjuzsqjwpmz.supabase.co
```

```
SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzYXliZXRsb3FqdXpzcWp3cG16Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjIwNjI5NywiZXhwIjoyMDc3NzgyMjk3fQ.vNuXCZLLVUxLoGBZqJh0TcadM3Zm7G7vPJzotIKPGNk
```

```
GOOGLE_API_KEY
AIzaSyAedlydsHYYmq3g3vM1R5io8eVDGhvL5I4
```

```
ABACUSAI_API_KEY
00cfc26a601045af92bcc83fa10dfc36
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. ✅ Your app is live!

### Step 6: Update NEXTAUTH_URL

After deployment completes:

1. Copy your Vercel URL (e.g., `https://resume-enhancer-xyz.vercel.app`)
2. Go to **Project Settings** → **Environment Variables**
3. Find `NEXTAUTH_URL`
4. Click **"Edit"**
5. Update value to your actual Vercel URL
6. Click **"Save"**
7. Click **"Redeploy"** to apply the change

---

## 🗄️ Database Setup (After First Deploy)

Run these commands to set up your database:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma generate
npx prisma db push
```

---

## ✅ Pre-Deployment Checklist

Before deploying, make sure:

- [x] All code pushed to GitHub ✅
- [x] Environment variables ready ✅
- [ ] Supabase bucket changed to PRIVATE (do this first!)
- [ ] All environment variables added in Vercel
- [ ] NEXTAUTH_URL updated after deployment
- [ ] Database migrations run

---

## 🔧 Troubleshooting

### Build Fails - Canvas Error

**Error**: `Package 'pangocairo' not found`

**Solution**: This is expected. The canvas package fails but isn't needed. Vercel should skip it automatically. If build fails, add this build command:

```
npm install --legacy-peer-deps --ignore-scripts && npm run build
```

### 500 Error After Deploy

**Possible causes**:
1. ❌ Database not accessible - Check DATABASE_URL
2. ❌ NEXTAUTH_URL not updated - Update with actual Vercel URL
3. ❌ Migrations not run - Run `npx prisma db push`

### Storage Upload Fails

**Possible causes**:
1. ❌ Bucket is PUBLIC - Change to PRIVATE in Supabase
2. ❌ Wrong service role key - Verify SUPABASE_SERVICE_ROLE_KEY

---

## 🎯 Post-Deployment Testing

After deployment:

1. **Visit your app** at the Vercel URL
2. **Sign up** for a new account
3. **Upload a resume** (PDF or DOCX)
4. **Test OCR** with a scanned PDF
5. **Enhance resume** with AI
6. **Download** the enhanced version

---

## 📊 Environment Variables Summary

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `DATABASE_URL` | PostgreSQL connection | Supabase Dashboard > Database |
| `NEXTAUTH_SECRET` | Session encryption | Already generated ✅ |
| `NEXTAUTH_URL` | Your app URL | Your Vercel deployment URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project | Already set ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Storage access | Supabase Dashboard > API |
| `GOOGLE_API_KEY` | OCR + Gemini | Already set ✅ |
| `ABACUSAI_API_KEY` | LLM fallback | Already set ✅ |

---

## 🚨 IMPORTANT: Before You Deploy

### Fix the Storage Bucket!

Your Supabase "resumes" bucket is currently PUBLIC. This is a security risk!

**Fix it now:**
1. Go to: https://supabase.com/dashboard/project/rsaybetloqjuzsqjwpmz/storage/buckets
2. Find "resumes" bucket
3. Click three dots (...) → "Edit bucket"
4. ❌ **UNCHECK** "Public bucket"
5. Click "Save"

**Why?** Resume files contain sensitive personal data. They should only be accessible via signed URLs.

---

## 🎉 You're Ready!

**Everything is set up:**
- ✅ Code pushed to GitHub
- ✅ Environment variables documented
- ✅ OCR functionality ready
- ✅ Multi-LLM support configured

**Just:**
1. Fix the bucket (make it private)
2. Deploy on Vercel
3. Update NEXTAUTH_URL
4. Run migrations
5. Test and enjoy!

---

**Questions?** Check `CURRENT_STATUS.md` for detailed status and troubleshooting.

**Good luck with your deployment! 🚀**
