# Complete Setup Instructions

## 📋 What I've Prepared For You

I've created all the setup files and scripts. Here's what's ready:

### Files Created:
1. ✅ `scripts/setup-supabase.sh` - Setup script with checklist
2. ✅ `scripts/test-supabase-connection.ts` - Connection test script
3. ✅ `supabase/storage-setup.sql` - SQL for storage policies
4. ✅ `supabase/edge-functions-setup.md` - Edge Functions guide
5. ✅ `.env.template` - Environment variables template
6. ✅ `SUPABASE_SETUP.md` - Detailed Supabase guide

---

## 🔑 Step 1: I Need These From You

Please provide the following information:

### A. Database Password
**Where to find it:**
1. Go to: https://supabase.com/dashboard/project/rsaybetloqjuzsqjwpmz/settings/database
2. Scroll to "Database Password"
3. If you don't remember it, click "Reset Database Password"
4. Copy the password

**What I need:** The password as plain text

---

### B. Service Role Key
**Where to find it:**
1. Go to: https://supabase.com/dashboard/project/rsaybetloqjuzsqjwpmz/settings/api
2. Look for "Project API keys" section
3. Find the row labeled "service_role"
4. Click the eye icon (👁️) to reveal the key
5. Copy the entire key (it's very long, starts with `eyJ`)

**What I need:** The full service_role key

---

### C. Storage Bucket Status
**Where to check:**
1. Go to: https://supabase.com/dashboard/project/rsaybetloqjuzsqjwpmz/storage/buckets
2. Look for a bucket named "resumes"

**What I need:**
- Does the "resumes" bucket exist? (Yes/No)
- If yes, is it set to Private or Public?

---

## 🚀 Step 2: After You Provide Info

Once you give me the above information, I will:

1. ✅ Create your `.env` file with all credentials
2. ✅ Test the Supabase connection
3. ✅ Verify storage bucket setup
4. ✅ Run database migrations
5. ✅ Test OCR functionality
6. ✅ Prepare for Vercel deployment

---

## 🔧 Step 3: Edge Function Secrets (Optional)

If you want to set up Edge Function secrets for Google API (advanced):

### Install Supabase CLI:
```bash
npm install -g supabase
```

### Login and Link:
```bash
supabase login
cd /home/user/Resume-enhancer
supabase link --project-ref rsaybetloqjuzsqjwpmz
```

### Set Secrets:
```bash
supabase secrets set GOOGLE_API_KEY=AIzaSyAedlydsHYYmq3g3vM1R5io8eVDGhvL5I4
```

**Note:** This is OPTIONAL. Your app will work fine using Vercel environment variables for the Google API key.

---

## 📊 What Happens Next

### Once I have your credentials:

**Step 1:** I'll create the `.env` file
```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.rsaybetloqjuzsqjwpmz.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://rsaybetloqjuzsqjwpmz.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
GOOGLE_API_KEY="AIzaSyAedlydsHYYmq3g3vM1R5io8eVDGhvL5I4"
NEXTAUTH_SECRET="[GENERATED-SECRET]"
NEXTAUTH_URL="http://localhost:3000"
ABACUSAI_API_KEY="00cfc26a601045af92bcc83fa10dfc36"
```

**Step 2:** Run connection test
```bash
npx tsx scripts/test-supabase-connection.ts
```

**Step 3:** Initialize database
```bash
npx prisma generate
npx prisma db push
```

**Step 4:** Start development server
```bash
npm run dev
```

**Step 5:** Test upload with a scanned PDF

---

## 🎯 Decision: Edge Functions or Vercel?

### Current Setup (Vercel - Recommended ✅)
**How it works:**
- OCR runs in Next.js API routes on Vercel
- Google API key stored in Vercel environment variables
- Simple, straightforward setup

**Pros:**
- ✅ Easy to set up and maintain
- ✅ Works with existing code
- ✅ No additional services to manage

**Cons:**
- ⚠️ Vercel has 10-second timeout on Hobby plan
- ⚠️ Cold starts can be slower

### Alternative: Supabase Edge Functions
**How it works:**
- OCR runs on Supabase Edge (Deno runtime)
- Google API key stored as Supabase secret
- Runs closer to your database

**Pros:**
- ✅ No timeout limits
- ✅ Faster execution (closer to data)
- ✅ Better for large files

**Cons:**
- ⚠️ More complex setup
- ⚠️ Need to rewrite OCR code for Deno
- ⚠️ Additional learning curve

**My Recommendation:** Start with Vercel (current setup). It's simpler and works great. If you hit timeout issues later, we can migrate to Edge Functions.

---

## ✅ Quick Checklist

Once you provide the credentials, here's what we'll verify:

- [ ] Database connection works
- [ ] Service role key is valid
- [ ] Storage bucket "resumes" exists (private)
- [ ] Google API key is configured
- [ ] Prisma schema is pushed to database
- [ ] Test file upload works
- [ ] OCR processes a scanned PDF successfully

---

## 🆘 Common Issues & Solutions

### "Connection refused" error
- ✅ Check database password is correct
- ✅ Ensure project is not paused in Supabase

### "Bucket not found" error
- ✅ Create "resumes" bucket in Supabase Storage
- ✅ Set it to Private (not Public)

### "Invalid API key" error
- ✅ Verify service_role key (not anon key)
- ✅ Check for extra spaces when copying

---

## 📞 Ready to Continue?

**Please provide:**
1. Database password
2. Service role key
3. Bucket status (exists: yes/no)

Once I have these, I'll set everything up and test it for you! 🚀
