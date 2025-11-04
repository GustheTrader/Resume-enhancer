# Ground UP Careers - Resume Enhancer

AI-powered resume enhancement tool to boost your career prospects with ATS optimization, professional formatting, and industry-specific improvements.

## Features

- **Multi-Provider AI Support**: Use OpenAI, Anthropic, or Google Gemini models
- **ATS Optimization**: Improve resume compatibility with Applicant Tracking Systems
- **Smart Enhancement**: Action verbs, keyword optimization, grammar checks, and formatting
- **Secure Storage**: AWS S3 integration for secure file storage
- **User Management**: Full authentication with NextAuth
- **API Key Management**: Encrypted storage of user API keys

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Storage**: AWS S3
- **Styling**: Tailwind CSS + shadcn/ui
- **AI Integration**: OpenAI, Anthropic, Google Gemini

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- AWS account (for S3 storage)
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
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - AWS credentials for S3 storage
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
   - `DATABASE_URL` - Your PostgreSQL connection string (use Vercel Postgres or external provider)
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

   **AWS S3 Storage:**
   - `AWS_REGION` - e.g., `us-west-2`
   - `AWS_BUCKET_NAME` - Your S3 bucket name
   - `AWS_FOLDER_PREFIX` - Folder prefix in S3 (e.g., `resumes/`)
   - `AWS_ACCESS_KEY_ID` - Your AWS access key
   - `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
   - `AWS_PROFILE` - e.g., `hosted_storage` (optional)

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
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Secret for NextAuth sessions | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your application URL | `https://your-app.vercel.app` |
| `AWS_REGION` | AWS region for S3 | `us-west-2` |
| `AWS_BUCKET_NAME` | S3 bucket name | `my-resume-bucket` |
| `AWS_FOLDER_PREFIX` | S3 folder prefix | `resumes/` |
| `AWS_ACCESS_KEY_ID` | AWS access key | Your AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Your AWS secret key |

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
- AWS S3 provides secure file storage
- Environment variables protect sensitive data
- `.env` files are gitignored

## Troubleshooting

### Build Errors on Vercel

If you encounter build errors:
1. Check that all environment variables are set
2. Ensure `DATABASE_URL` is accessible from Vercel
3. Check Vercel build logs for specific errors

### Database Connection Issues

- Ensure your PostgreSQL instance allows connections from Vercel IPs
- For Vercel Postgres, connection pooling is automatic
- For external databases, you may need to enable connection pooling

### S3 Upload Issues

- Verify AWS credentials have proper S3 permissions
- Check bucket CORS configuration if needed
- Ensure bucket exists and is accessible

## Support

For issues and questions, please open an issue on GitHub.

## License

MIT License - feel free to use this project for your own purposes.
