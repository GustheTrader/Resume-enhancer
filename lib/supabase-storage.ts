import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const BUCKET_NAME = 'resumes';

/**
 * Upload a file to Supabase Storage
 * @param buffer File buffer
 * @param fileName Original file name
 * @returns Storage path of the uploaded file
 */
export async function uploadFile(buffer: Buffer, fileName: string): Promise<string> {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `uploads/${timestamp}-${sanitizedFileName}`;

  // Determine content type based on file extension
  const contentType = fileName.endsWith('.pdf')
    ? 'application/pdf'
    : fileName.endsWith('.docx')
    ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    : fileName.endsWith('.doc')
    ? 'application/msword'
    : 'application/octet-stream';

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  return data.path;
}

/**
 * Get a signed URL for downloading a file
 * @param filePath Path to the file in storage
 * @param expiresIn Expiration time in seconds (default: 3600 = 1 hour)
 * @returns Signed URL for downloading the file
 */
export async function downloadFile(filePath: string, expiresIn: number = 3600): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    console.error('Supabase download error:', error);
    throw new Error(`Failed to generate download URL: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param filePath Path to the file in storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Supabase delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Rename a file by downloading and re-uploading
 * Note: Supabase doesn't support direct renaming, so we download and re-upload
 * @param oldPath Current path of the file
 * @param newFileName New file name
 * @returns New file path
 */
export async function renameFile(oldPath: string, newFileName: string): Promise<string> {
  // Download the file
  const { data: fileData, error: downloadError } = await supabase.storage
    .from(BUCKET_NAME)
    .download(oldPath);

  if (downloadError) {
    throw new Error(`Failed to download file for renaming: ${downloadError.message}`);
  }

  // Convert to buffer
  const buffer = Buffer.from(await fileData.arrayBuffer());

  // Upload with new name
  const newPath = await uploadFile(buffer, newFileName);

  // Delete old file
  await deleteFile(oldPath);

  return newPath;
}

/**
 * Get the public URL for a file (if bucket is public)
 * @param filePath Path to the file in storage
 * @returns Public URL
 */
export function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Initialize the storage bucket if it doesn't exist
 * This should be run during setup
 */
export async function initializeBucket(): Promise<void> {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }

  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);

  if (!bucketExists) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: false,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ],
    });

    if (createError) {
      console.error('Error creating bucket:', createError);
    } else {
      console.log(`Bucket '${BUCKET_NAME}' created successfully`);
    }
  }
}
