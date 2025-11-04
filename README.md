# Ground UP Careers - Resume Enhancer

AI-powered resume enhancement tool to boost your career prospects with ATS optimization, professional formatting, and industry-specific improvements.

## Features

- **Multi-Provider AI Support**: Use OpenAI, Anthropic, or Google Gemini models
- **ATS Optimization**: Improve resume compatibility with Applicant Tracking Systems
- **Smart Enhancement**: Action verbs, keyword optimization, grammar checks, and formatting
- **Secure Storage**: Supabase Storage for secure file storage
- **User Management**: Full authentication with NextAuth
- **API Key Management**: Encrypted storage of user API keys

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + shadcn/ui
- **AI Integration**: OpenAI, Anthropic, Google Gemini

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (includes PostgreSQL database and storage)
- API keys for AI providers (optional - users can add their own)

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Resume-enhancer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in your values:
   - `DATABASE_URL`: Supabase PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - API keys (optional)

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed  # Optional: seed with initial data
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## Setting Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create an account
   - Click "New Project"
   - Enter project details and create your project

2. **Get Your Connection Credentials**
   - Go to Project Settings > Database
   - Copy the "Connection String" (URI mode)
   - Go to Project Settings > API
   - Copy the "URL" for `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the "service_role" key for `SUPABASE_SERVICE_ROLE_KEY`

3. **Create Storage Bucket**
   - Go to Storage in the Supabase dashboard
   - Click "Create a new bucket"
   - Name it `resumes`
   - Set it as **private** (not public)
   - Click "Create bucket"

4. **Set Up Bucket Policies (Optional)**
   If you want fine-grained access control, you can set up Row Level Security policies on the storage bucket through the Supabase SQL editor.

## Deploying to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Manual Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables in Vercel**

   Go to Project Settings → Environment Variables and add:

   **Required:**
   - `DATABASE_URL` - Your Supabase PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

   **Supabase Configuration:**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (from Project Settings > API)
   - `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (from Project Settings > API)

   **Optional (if providing default API keys):**
   - `ABACUSAI_API_KEY` - AbacusAI API key
   - Users can also add their own API keys through the app interface

4. **Database Setup on Vercel**

   After deployment, run migrations:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Link project
   vercel link

   # Run Prisma commands
   vercel env pull .env.local
   npx prisma generate
   npx prisma db push
   ```

5. **Deploy**
   - Vercel will automatically deploy on every push to your main branch
   - Or click "Deploy" in the Vercel dashboard

## Environment Variables Reference

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres` |
| `NEXTAUTH_SECRET` | Secret for NextAuth sessions | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your application URL | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://[PROJECT-REF].supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Get from Supabase Project Settings > API |

### Optional

| Variable | Description |
|----------|-------------|
| `ABACUSAI_API_KEY` | AbacusAI API key for AI features |

**Note**: Users can configure their own OpenAI, Anthropic, and Google API keys through the app's settings page. These are encrypted and stored in the database.

## Database Schema

The application uses Prisma with PostgreSQL. Key models:
- `User` - User accounts and profiles
- `Resume` - Uploaded resumes
- `ResumeEnhancement` - AI enhancement results
- `UserApiKey` - Encrypted user API keys
- `SystemLog` - Application logs

## Features Overview

### For Users
- Upload resumes (PDF, DOCX)
- AI-powered enhancement with multiple strategies
- Download enhanced resumes
- Manage personal API keys securely
- View enhancement history

### For Administrators
- User management
- System logs and diagnostics
- API key monitoring

## Security Notes

- All API keys are encrypted before storage
- NextAuth handles secure authentication
- Supabase provides secure file storage with Row Level Security (RLS)
- Environment variables protect sensitive data
- `.env` files are gitignored

## Troubleshooting

### Build Errors on Vercel

If you encounter build errors:
1. Check that all environment variables are set
2. Ensure `DATABASE_URL` is accessible from Vercel
3. Check Vercel build logs for specific errors

### Database Connection Issues

- Ensure your Supabase project is active
- Check that the connection string includes the correct password
- Supabase automatically handles connection pooling

### Storage Upload Issues

- Verify the `resumes` bucket exists in Supabase Storage
- Check that the service role key has proper permissions
- Ensure bucket policies allow file uploads
- Run the bucket initialization if needed (see setup instructions)

## Support

For issues and questions, please open an issue on GitHub.

## License

MIT License - feel free to use this project for your own purposes.
