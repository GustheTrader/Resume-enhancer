# Environment Variables - Verification Checklist

✅ Everything is pushed to GitHub!
Branch: `claude/review-and-vercel-deploy-011CUmvr5VnH4tGu5az1HmJh`

---

## 🔐 Environment Variables for Vercel

Copy each variable below **EXACTLY** as shown. Check them off as you add them to Vercel.

---

### ✅ Variable 1: DATABASE_URL

**Variable Name:**
```
DATABASE_URL
```

**Value:**
```
postgresql://postgres:Wg5hDii2ZKYOQfNy@db.rsaybetloqjuzsqjwpmz.supabase.co:5432/postgres
```

**Environments:** ☑️ Production ☑️ Preview ☑️ Development

**What it does:** Connects to your Supabase PostgreSQL database

---

### ✅ Variable 2: NEXTAUTH_SECRET

**Variable Name:**
```
NEXTAUTH_SECRET
```

**Value:**
```
JzmuN+yrszyonOp4VI2IpgL6JNGI514zPf+HL4KXaZY=
```

**Environments:** ☑️ Production ☑️ Preview ☑️ Development

**What it does:** Encrypts session cookies for NextAuth authentication

---

### ✅ Variable 3: NEXTAUTH_URL

**Variable Name:**
```
NEXTAUTH_URL
```

**Value (Initial):**
```
https://your-app-name.vercel.app
```

**⚠️ IMPORTANT:**
- Use a placeholder URL for first deployment
- After deployment, come back and update this with your ACTUAL Vercel URL
- Then redeploy

**Environments:** ☑️ Production ☑️ Preview ☑️ Development

**What it does:** Tells NextAuth where your app is hosted

---

### ✅ Variable 4: NEXT_PUBLIC_SUPABASE_URL

**Variable Name:**
```
NEXT_PUBLIC_SUPABASE_URL
```

**Value:**
```
https://rsaybetloqjuzsqjwpmz.supabase.co
```

**Environments:** ☑️ Production ☑️ Preview ☑️ Development

**What it does:** Your Supabase project URL (public, used in frontend)

---

### ✅ Variable 5: SUPABASE_SERVICE_ROLE_KEY

**Variable Name:**
```
SUPABASE_SERVICE_ROLE_KEY
```

**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzYXliZXRsb3FqdXpzcWp3cG16Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjIwNjI5NywiZXhwIjoyMDc3NzgyMjk3fQ.vNuXCZLLVUxLoGBZqJh0TcadM3Zm7G7vPJzotIKPGNk
```

**Environments:** ☑️ Production ☑️ Preview ☑️ Development

**What it does:** Server-side access to Supabase (bypasses RLS, use carefully)

**🔒 KEEP SECRET:** Never expose this in frontend code

---

### ✅ Variable 6: GOOGLE_API_KEY

**Variable Name:**
```
GOOGLE_API_KEY
```

**Value:**
```
AIzaSyAedlydsHYYmq3g3vM1R5io8eVDGhvL5I4
```

**Environments:** ☑️ Production ☑️ Preview ☑️ Development

**What it does:** Powers OCR for scanned PDFs using Google Gemini Vision

---

### ✅ Variable 7: ABACUSAI_API_KEY

**Variable Name:**
```
ABACUSAI_API_KEY
```

**Value:**
```
00cfc26a601045af92bcc83fa10dfc36
```

**Environments:** ☑️ Production ☑️ Preview ☑️ Development

**What it does:** Fallback LLM provider if users don't configure their own API keys

---

## 📋 Verification Checklist

Before deploying, verify:

- [ ] Variable 1: DATABASE_URL added ✓
- [ ] Variable 2: NEXTAUTH_SECRET added ✓
- [ ] Variable 3: NEXTAUTH_URL added (placeholder for now) ✓
- [ ] Variable 4: NEXT_PUBLIC_SUPABASE_URL added ✓
- [ ] Variable 5: SUPABASE_SERVICE_ROLE_KEY added ✓
- [ ] Variable 6: GOOGLE_API_KEY added ✓
- [ ] Variable 7: ABACUSAI_API_KEY added ✓
- [ ] ALL variables have 3 environments checked ✓
- [ ] Supabase bucket changed to PRIVATE ✓

---

## 🎯 How to Add in Vercel

### For Each Variable:

1. Go to your project in Vercel
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in left sidebar
4. Click **"Add New"**
5. Enter the **Variable Name** (e.g., `DATABASE_URL`)
6. Enter the **Value** (copy exactly from above)
7. Check ALL THREE boxes:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
8. Click **"Save"**
9. Repeat for all 7 variables

---

## 🚀 After Adding All Variables

1. Click **"Deployments"** tab
2. Click **"Deploy"** or **"Redeploy"**
3. Wait for build to complete
4. Copy your deployment URL
5. Go back to Environment Variables
6. Edit `NEXTAUTH_URL` with your real URL
7. Save and redeploy

---

## ✅ Expected Success

When deployment succeeds, you'll see:

```
✓ Prisma schema loaded from prisma/schema.prisma
✓ Generated Prisma Client
✓ Building pages...
✓ Compiled successfully
✓ Deployment ready
```

---

## 🆘 If You Get Errors

**Error: "Secret database not deployed"**
→ Check DATABASE_URL is set correctly

**Error: "Cannot find module '@prisma/client'"**
→ This is now fixed in the code!

**Error: "NEXTAUTH_URL mismatch"**
→ Update NEXTAUTH_URL with your actual Vercel URL

---

## 📊 Summary

✅ **GitHub Status:** All pushed and up-to-date
✅ **Commits:** 7 commits on deployment branch
✅ **Latest Fix:** Prisma build configuration fixed
✅ **Variables Ready:** All 7 variables documented above

**You're ready to deploy! Just add these 7 variables in Vercel.** 🚀
