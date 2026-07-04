import { convertToBase64 } from './imageProcessor';
import { extractTextFromPdf } from './pdfProcessor';
import { classifyDocument } from './documentClassifier';
import { analyzeDocumentContent } from './documentAnalyzer';

/**
 * Orchestrates the entire document analysis process using two sequential passes.
 * 
 * @param {File} file - Uploaded document file (PDF or Image)
 * @param {string} targetLanguageName - Target translation language name (e.g. 'Hindi')
 * @param {string} modelName - Model name to target on Ollama (e.g. 'gemma4:e2b')
 * @param {Function} onProgress - Progress status message callback
 * @returns {Promise<string>} Structured JSON output text matching client schema
 */
export async function analyze(file, targetLanguageName, modelName = 'gemma4:e2b', onProgress = () => {}) {
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const isImage = validImageTypes.includes(file.type);
  const isPdf = file.type === 'application/pdf';

  if (!isImage && !isPdf) {
    throw new Error('Unsupported file format. Please upload a PDF or an Image (JPG, JPEG, PNG, WEBP).');
  }

  let textContent = null;
  let images = null;

  // 1. Process files based on content type
  if (isPdf) {
    textContent = await extractTextFromPdf(file, modelName, onProgress);
    if (!textContent) {
      throw new Error('The PDF document contains no readable text or image layers.');
    }
  } else if (isImage) {
    onProgress('Converting document image...');
    const base64Image = await convertToBase64(file);
    images = [base64Image];
  }

  // 2. Perform Pass 1: Classification & Verbatim Extraction
  onProgress('Identifying document type and language...');
  const pass1Result = await classifyDocument(textContent, images, modelName);
  
  if (!pass1Result || !pass1Result.raw_text) {
    throw new Error('Verification failed. Unable to transcribe document content.');
  }

  // 3. Perform Pass 2: Structured Summarization & Checklists
  onProgress('Running comprehensive Gemma AI analysis...');
  const pass2Result = await analyzeDocumentContent(
    pass1Result.document_type, 
    pass1Result.raw_text, 
    targetLanguageName, 
    modelName
  );

  return pass2Result;
}
