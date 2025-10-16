
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

// Ensure the key is exactly 32 bytes for aes-256
function getKey(): Buffer {
  const secret = process.env.NEXTAUTH_SECRET || 'default-secret-key-32-chars-long!!';
  // Create a hash to ensure we have exactly 32 bytes
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptApiKey(text: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const key = getKey();
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt API key');
  }
}

export function decryptApiKey(encryptedText: string): string {
  try {
    const [ivHex, encrypted] = encryptedText.split(':');
    if (!ivHex || !encrypted) {
      throw new Error('Invalid encrypted text format');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const key = getKey();
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt API key');
  }
}
