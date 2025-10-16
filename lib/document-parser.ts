import mammoth from 'mammoth';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Simple PDF text extractor using pdf2json
async function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-parse-'));
    const tempPdfPath = path.join(tempDir, 'temp.pdf');
    
    try {
      // Write buffer to temp file
      fs.writeFileSync(tempPdfPath, buffer);
      
      // Use pdf2json for parsing
      const PDFParser = require('pdf2json');
      const pdfParser = new PDFParser();
      
      let allText = '';
      
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          // Extract text from all pages
          if (pdfData?.Pages) {
            for (const page of pdfData.Pages) {
              if (page.Texts) {
                for (const text of page.Texts) {
                  if (text.R) {
                    for (const r of text.R) {
                      if (r.T) {
                        // Safely decode URI component - fallback to raw text if decode fails
                        try {
                          const decodedText = decodeURIComponent(r.T);
                          allText += decodedText + ' ';
                        } catch (decodeError) {
                          // If URI decoding fails, use the raw text
                          allText += r.T + ' ';
                        }
                      }
                    }
                  }
                }
                allText += '\n'; // New line after each page
              }
            }
          }
          
          // Cleanup
          try {
            fs.unlinkSync(tempPdfPath);
            fs.rmdirSync(tempDir);
          } catch (e) {
            console.warn('Failed to cleanup temp files:', e);
          }
          
          resolve(allText);
        } catch (error) {
          reject(error);
        }
      });
      
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        // Cleanup
        try {
          if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);
          if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
        } catch (e) {
          console.warn('Failed to cleanup temp files:', e);
        }
        
        reject(new Error(errData.parserError || 'Failed to parse PDF'));
      });
      
      pdfParser.loadPDF(tempPdfPath);
    } catch (error) {
      // Cleanup on error
      try {
        if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);
        if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
      } catch (e) {
        console.warn('Failed to cleanup temp files:', e);
      }
      
      reject(error);
    }
  });
}

export async function parseDocxFile(buffer: Buffer): Promise<string> {
  try {
    console.log('Parsing DOCX file...');
    const result = await mammoth.extractRawText({ buffer });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No text content could be extracted from the DOCX file');
    }
    
    console.log(`DOCX parsing successful. Extracted ${result.value.length} characters`);
    return result.value;
  } catch (error: any) {
    console.error('Error parsing DOCX file:', error);
    throw new Error(`Failed to parse DOCX file: ${error?.message || 'Unknown error'}`);
  }
}

export async function parseDocFile(buffer: Buffer): Promise<string> {
  try {
    console.log('Parsing DOC file...');
    // For .doc files, we'll try mammoth first, but it may not work perfectly
    const result = await mammoth.extractRawText({ arrayBuffer: buffer.buffer });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No text content could be extracted from the DOC file. Please convert to DOCX format for better compatibility.');
    }
    
    console.log(`DOC parsing successful. Extracted ${result.value.length} characters`);
    return result.value;
  } catch (error: any) {
    console.error('Error parsing DOC file:', error);
    throw new Error(`Failed to parse DOC file: ${error?.message || 'Unknown error'}. Please use DOCX format for better compatibility.`);
  }
}

export async function parsePdfFile(buffer: Buffer): Promise<string> {
  try {
    console.log('Attempting PDF text extraction...');
    
    // Validate buffer
    if (!buffer || buffer.length === 0) {
      throw new Error('Invalid PDF buffer');
    }
    
    console.log(`Processing PDF buffer of size: ${buffer.length} bytes`);
    
    // Extract text using pdf2json
    let text = await extractPdfText(buffer);
    
    // Check if we got any text
    if (!text || text.trim().length === 0) {
      console.error('PDF text extraction returned empty result');
      throw new Error('This PDF appears to be image-based or scanned. Please upload a text-based PDF or convert it using OCR first.');
    }
    
    console.log(`Initial extraction: ${text.length} characters`);
    
    // Clean up the extracted text
    // 1. Remove excessive whitespace
    text = text.replace(/[ \t]+/g, ' '); // Multiple spaces/tabs to single space
    text = text.replace(/\n{3,}/g, '\n\n'); // Multiple newlines to max 2
    text = text.trim();
    
    // 2. Check minimum content threshold
    if (text.length < 50) {
      throw new Error('PDF content too short after cleaning. Please ensure the PDF contains readable text content.');
    }
    
    // 3. Limit total size (max ~100k characters for safety)
    if (text.length > 100000) {
      console.warn(`PDF text too long (${text.length} chars), truncating to 100k chars`);
      text = text.substring(0, 100000) + '\n\n[Content truncated due to size]';
    }
    
    console.log(`PDF parsing successful. Final text length: ${text.length} characters`);
    
    return text;
  } catch (error: any) {
    console.error('Error parsing PDF file:', error);
    const errorMessage = error?.message || 'Unknown error';
    
    // Provide specific error messages
    if (errorMessage.includes('encrypted') || errorMessage.includes('password')) {
      throw new Error('This PDF is encrypted or password-protected. Please upload an unencrypted PDF.');
    } else if (errorMessage.includes('ENOENT') || errorMessage.includes('no such file')) {
      throw new Error('Could not process PDF. The file may be corrupted.');
    } else if (errorMessage.includes('image-based') || errorMessage.includes('scanned')) {
      throw new Error(errorMessage);
    }
    
    // Generic error with details
    throw new Error(`Failed to parse PDF: ${errorMessage}`);
  }
}