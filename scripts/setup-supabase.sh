#!/bin/bash

# Supabase Setup Script for Resume Enhancer
# This script helps you configure Supabase for your project

echo "=================================="
echo "Supabase Setup for Resume Enhancer"
echo "Project: rsaybetloqjuzsqjwpmz"
echo "=================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. Installing..."
    npm install -g supabase
else
    echo "✅ Supabase CLI is installed"
fi

echo ""
echo "📋 Setup Checklist:"
echo ""
echo "1. Database Password"
echo "   - Go to: https://supabase.com/dashboard/project/rsaybetloqjuzsqjwpmz/settings/database"
echo "   - Copy or reset your database password"
echo ""

echo "2. Service Role Key"
echo "   - Go to: https://supabase.com/dashboard/project/rsaybetloqjuzsqjwpmz/settings/api"
echo "   - Copy the 'service_role' key"
echo ""

echo "3. Create Storage Bucket"
echo "   - Go to: https://supabase.com/dashboard/project/rsaybetloqjuzsqjwpmz/storage/buckets"
echo "   - Create bucket named 'resumes' (private)"
echo ""

echo "4. Set Edge Function Secrets (for Google API)"
echo "   Run these commands after linking your project:"
echo ""
echo "   supabase link --project-ref rsaybetloqjuzsqjwpmz"
echo "   supabase secrets set GOOGLE_API_KEY=AIzaSyAedlydsHYYmq3g3vM1R5io8eVDGhvL5I4"
echo ""

echo "=================================="
echo "Ready to configure? (This script will help create your .env file)"
echo "=================================="
