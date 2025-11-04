# Supabase Edge Functions Setup

This guide explains how to set up Edge Function secrets for your Google API key in Supabase.

## What are Edge Function Secrets?

Edge Function secrets allow you to securely store sensitive data (like API keys) that your Supabase Edge Functions can access without exposing them in your code.

## Prerequisites

1. Supabase CLI installed
2. Authenticated with Supabase
3. Project linked to your local environment

## Step 1: Install Supabase CLI (if not already installed)

```bash
npm install -g supabase
```

## Step 2: Login to Supabase

```bash
supabase login
```

This will open a browser window to authenticate.

## Step 3: Link Your Project

```bash
cd /home/user/Resume-enhancer
supabase link --project-ref rsaybetloqjuzsqjwpmz
```

You'll be prompted to enter your database password.

## Step 4: Set Edge Function Secrets

Now you can set secrets that will be available to all Edge Functions:

```bash
# Set Google API Key
supabase secrets set GOOGLE_API_KEY=AIzaSyAedlydsHYYmq3g3vM1R5io8eVDGhvL5I4

# Optional: Set other secrets
supabase secrets set ABACUSAI_API_KEY=00cfc26a601045af92bcc83fa10dfc36
```

## Step 5: Verify Secrets

List all secrets (values will be hidden):

```bash
supabase secrets list
```

## Step 6: Using Secrets in Edge Functions

In your Edge Functions, access secrets via:

```typescript
const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
```

## Important Notes

⚠️ **Security**:
- Secrets are encrypted and only accessible to Edge Functions
- Never commit secrets to git
- Secrets are environment-specific (production/staging)

🔄 **Updating Secrets**:
- To update a secret, just run the `set` command again
- Changes take effect immediately

🗑️ **Deleting Secrets**:
```bash
supabase secrets unset GOOGLE_API_KEY
```

## Edge Functions vs Environment Variables

**Edge Functions Secrets** (Supabase specific):
- Stored in Supabase
- Only accessible to Edge Functions
- Set via Supabase CLI
- Use: `Deno.env.get('SECRET_NAME')`

**Vercel Environment Variables** (for Next.js app):
- Stored in Vercel
- Accessible to your Next.js API routes
- Set via Vercel dashboard
- Use: `process.env.SECRET_NAME`

## Current Setup

For your Resume Enhancer app:

**Google API Key is used in**:
1. ✅ Next.js API routes (upload-resume) → Use Vercel env vars
2. ✅ OCR processing (lib/ocr.ts) → Use Vercel env vars
3. 🔜 Optional: Edge Functions (if you want to move OCR to the edge)

## Do You Need Edge Functions?

**Current Setup**: OCR runs in Next.js API routes ✅
- Pros: Simple, works with existing code
- Cons: Slower cold starts, runs on Vercel

**Edge Functions Option**: Move OCR to Supabase Edge Functions
- Pros: Faster, runs closer to data, no Vercel timeout limits
- Cons: More complex setup

**Recommendation**: Start with current setup (Vercel). Move to Edge Functions later if needed for performance.
