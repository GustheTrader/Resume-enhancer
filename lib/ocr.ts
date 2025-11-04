import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Extract text from image-based PDF using Google Gemini Vision API
 * @param buffer PDF file buffer
 * @returns Extracted text content
 */
export async function extractTextWithOCR(buffer: Buffer): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY environment variable is not set. OCR functionality requires a Google API key.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Convert buffer to base64
    const base64Data = buffer.toString('base64');

    const prompt = `Extract all text content from this PDF/document image.

IMPORTANT INSTRUCTIONS:
- Extract ALL visible text exactly as it appears
- Maintain the original formatting and structure
- Include names, dates, job titles, company names, skills, and all other text
- Preserve bullet points and list structures
- Keep section headers and organization
- Output ONLY the extracted text, no additional commentary

Please extract the complete text from this document:`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: 'application/pdf',
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error('No text could be extracted from the document using OCR');
    }

    console.log(`OCR extraction successful. Extracted ${text.length} characters`);
    return text;

  } catch (error: any) {
    console.error('Gemini Vision OCR error:', error);
    throw new Error(`OCR extraction failed: ${error?.message || 'Unknown error'}`);
  }
}
