# Supabase Setup Guide

This guide will help you set up Supabase for your Resume Enhancer application.

## Your Project Details

**Supabase Project ID**: `rsaybetloqjuzsqjwpmz`
**Project URL**: `https://rsaybetloqjuzsqjwpmz.supabase.co`

## Step 1: Access Your Supabase Project

Go to: https://supabase.com/dashboard/project/rsaybetloqjuzsqjwpmz

## Step 2: Get Database Connection String

1. Navigate to: **Project Settings > Database**
   - Direct link: https://supabase.com/dashboard/project/rsaybetloqjuzsqjwpmz/settings/database

2. Scroll to **Connection String** section

3. Select **URI** mode (not Transaction mode)

4. Copy the connection string. It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.rsaybetloqjuzsqjwpmz.supabase.co:5432/postgres
   ```

5. **Important**: Replace `[YOUR-PASSWORD]` with your actual database password
   - If you don't remember it, you can reset it in the same Database settings page

6. Use this as your `DATABASE_URL` environment variable

## Step 3: Get API Credentials

1. Navigate to: **Project Settings > API**
   - Direct link: https://supabase.com/dashboard/project/rsaybetloqjuzsqjwpmz/settings/api

2. Copy the following values:

   **Project URL** (for `NEXT_PUBLIC_SUPABASE_URL`):
   ```
   https://rsaybetloqjuzsqjwpmz.supabase.co
   ```

   **service_role key** (for `SUPABASE_SERVICE_ROLE_KEY`):
   - Look for "service_role" under "Project API keys"
   - Click the eye icon to reveal the secret key
   - Copy the entire key (starts with `eyJ...`)
   - ⚠️ **Important**: Keep this secret! Never commit to git or share publicly

## Step 4: Create Storage Bucket

1. Navigate to: **Storage**
   - Direct link: https://supabase.com/dashboard/project/rsaybetloqjuzsqjwpmz/storage/buckets

2. Click **"Create a new bucket"** (or "New bucket")

3. Enter bucket details:
   - **Name**: `resumes`
   - **Public bucket**: ❌ **OFF** (keep it private)
   - **File size limit**: 10 MB (or your preference)
   - **Allowed MIME types**:
     - `application/pdf`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
     - `application/msword`

4. Click **"Create bucket"**

5. ✅ Your storage is ready!

## Step 5: Set Up Environment Variables

### For Local Development

Create a `.env` file in your project root:

```bash
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.rsaybetloqjuzsqjwpmz.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="[generate-with-openssl-rand-base64-32]"
NEXTAUTH_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://rsaybetloqjuzsqjwpmz.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="[your-service-role-key]"

# Google API Key (for OCR and Gemini)
GOOGLE_API_KEY="AIzaSyAedlydsHYYmq3g3vM1R5io8eVDGhvL5I4"

# Optional
ABACUSAI_API_KEY="00cfc26a601045af92bcc83fa10dfc36"
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### For Vercel Deployment

Go to your Vercel project settings and add these environment variables:

1. **Project Settings > Environment Variables**

2. Add each variable:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.rsaybetloqjuzsqjwpmz.supabase.co:5432/postgres` | Replace [PASSWORD] |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | Keep secret |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel URL |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rsaybetloqjuzsqjwpmz.supabase.co` | Public URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service_role key from Supabase | Keep secret |
| `GOOGLE_API_KEY` | `AIzaSyAedlydsHYYmq3g3vM1R5io8eVDGhvL5I4` | For OCR & Gemini |
| `ABACUSAI_API_KEY` | `00cfc26a601045af92bcc83fa10dfc36` | Optional |

## Step 6: Initialize Database Schema

After setting up environment variables, run:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Seed database
npx prisma db seed
```

## Step 7: Verify Setup

1. **Check Database Connection**:
   ```bash
   npx prisma db pull
   ```
   Should connect successfully without errors

2. **Check Storage Bucket**:
   - Go to Storage in Supabase dashboard
   - You should see the `resumes` bucket listed

3. **Test Upload**:
   - Run your app locally: `npm run dev`
   - Try uploading a resume
   - Check Supabase Storage to see if file appears

## Troubleshooting

### Database Connection Issues

**Error**: "Connection timed out" or "Connection refused"
- ✅ Check your database password is correct
- ✅ Ensure connection string uses the correct format
- ✅ Verify your Supabase project is active (not paused)

### Storage Upload Issues

**Error**: "Storage bucket not found"
- ✅ Verify bucket name is exactly `resumes`
- ✅ Check SUPABASE_SERVICE_ROLE_KEY is correct
- ✅ Ensure bucket exists in Supabase dashboard

**Error**: "Insufficient permissions"
- ✅ Use service_role key (not anon key)
- ✅ Check bucket is created and accessible

### OCR Not Working

**Error**: "GOOGLE_API_KEY environment variable is not set"
- ✅ Add GOOGLE_API_KEY to environment variables
- ✅ Restart your development server after adding

**Error**: "API key not valid"
- ✅ Verify the Google API key is correct
- ✅ Enable Generative Language API in Google Cloud Console

## Next Steps

Once setup is complete:

1. ✅ Deploy to Vercel
2. ✅ Add environment variables in Vercel
3. ✅ Run database migrations on Vercel
4. ✅ Test the application
5. ✅ Upload a test resume
6. ✅ Try OCR with a scanned PDF

## Support

If you encounter issues:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review application logs in Vercel
- Check browser console for client-side errors
- Verify all environment variables are set correctly
