-- Storage Bucket Setup for Resume Enhancer
-- Run this in Supabase SQL Editor if bucket doesn't exist

-- Create the resumes bucket (if not exists via UI)
-- Note: Buckets are typically created via the Supabase UI, but you can verify with:
SELECT * FROM storage.buckets WHERE name = 'resumes';

-- Set up Row Level Security (RLS) policies for the resumes bucket
-- This allows authenticated users to upload and manage their own files

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow users to read their own files
CREATE POLICY "Users can read their own resumes"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow users to update their own files
CREATE POLICY "Users can update their own resumes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow users to delete their own files
CREATE POLICY "Users can delete their own resumes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow service role to manage all files (for server-side operations)
CREATE POLICY "Service role can manage all resumes"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'resumes')
WITH CHECK (bucket_id = 'resumes');
