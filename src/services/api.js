import { convertToBase64 } from './imageProcessor';

/**
 * Helper: Converts a specific PDF page to a base64 JPEG image using canvas rendering.
 * 
 * @param {Object} pdf - Loaded PDF.js document object
 * @param {number} pageNumber - 1-indexed page number
 * @returns {Promise<string>} Base64 image data string (excluding prefix)
 */
export const convertPdfPageToImage = async (pdf, pageNumber) => {
  try {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 }); // Scale for clear text transcription
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    return dataUrl.split(',')[1];
  } catch (error) {
    console.error(`Page ${pageNumber} rendering error:`, error);
    throw new Error(`Failed to convert page ${pageNumber} to an image for optical analysis.`);
  }
};

/**
 * Helper: Uses local Ollama vision capabilities to extract raw text content from a page image.
 * 
 * @param {string} base64Image - Base64 encoded JPEG string
 * @param {number} pageNumber - Page number being transcribed
 * @param {string} modelName - Model name to run on Ollama
 * @returns {Promise<string>} Transcribed text contents
 */
export const extractTextFromScannedPage = async (base64Image, pageNumber, modelName) => {
  const payload = {
    model: modelName,
    prompt: `This is page ${pageNumber} of a scanned government document. Transcribe all text contents, tables, headers, names, dates, amounts, reference numbers, and warnings verbatim in plain text. Do not summarize yet, just transcribe the raw content.`,
    images: [base64Image],
    stream: false
  };

  try {
    const response = await fetch('/ollama/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Model '${modelName}' not found. Run 'ollama pull ${modelName}' in your terminal.`);
      }
      throw new Error(`Ollama text extraction failed on page ${pageNumber} with status ${response.status}`);
    }

    const data = await response.json();
    return data.response || '';
  } catch (error) {
    console.error(`Page ${pageNumber} transcription call failed:`, error);
    throw error;
  }
};


/**
 * Reads a PDF document. Automatically determines whether it has selectable text.
 * If yes, extracts text. If scanned, renders pages to canvases and performs page OCR.
 * 
 * @param {File} file - PDF document file
 * @param {string} modelName - Local Ollama model name (e.g. gemma4:e2b)
 * @param {Function} onProgress - Progress status callback
 * @returns {Promise<string>} Extracted text context
 */
export const extractTextFromPdf = async (file, modelName, onProgress = () => {}) => {
  if (!window.pdfjsLib) {
    throw new Error('PDF.js library is not loaded. Please refresh the page or check your connection.');
  }

  try {
    onProgress('Loading PDF document layers...');
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let selectableText = '';
    
    onProgress('Scanning for selectable text...');
    // 1. Try extracting selectable text
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      selectableText += pageText + ' ';
    }
    
    selectableText = selectableText.trim();

    // 2. If PDF contains selectable text (threshold: 50 characters), return it
    if (selectableText.length >= 50) {
      onProgress('Selectable text found. Reading text pages...');
      return selectableText;
    }
    
    // 3. Otherwise, PDF is a scanned document. Convert each page to image and perform OCR
    onProgress(`Scanned PDF detected (${pdf.numPages} pages). Preparing OCR...`);
    let combinedTranscription = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      onProgress(`Converting page ${i} of ${pdf.numPages} to image...`);
      const base64Page = await convertPdfPageToImage(pdf, i);
      
      onProgress(`Transcribing page ${i} of ${pdf.numPages} via vision AI...`);
      const transcribedPage = await extractTextFromScannedPage(base64Page, i, modelName);
      combinedTranscription += `--- Scanned Page ${i} Transcribed Content ---\n${transcribedPage}\n\n`;
    }
    
    return combinedTranscription.trim();
  } catch (error) {
    console.error('PDF text extraction pipeline error:', error);
    if (error.message && (error.message.includes('not found') || error.message.includes('Ollama text extraction failed'))) {
      throw new Error(`Failed to read scanned PDF. Ensure your local model '${modelName}' is multimodal (vision-enabled) and Ollama is active.`);
    }
    throw error;
  }
};

/**
 * Sends document contents to a local Ollama server running gemma4:e2b.
 * Enforces structured JSON responses containing document details, translations, checklists.
 * 
 * @param {File} file - PDF or image file (JPG, JPEG, PNG, WEBP)
 * @param {string} targetLanguageName - Target language name (e.g. 'Hindi', 'Bengali')
 * @param {string} modelName - Model name to run on Ollama (default: gemma4:e2b)
 * @param {Function} onProgress - Progress status callback
 * @returns {Promise<string>} Raw JSON text response from the model
 */
export const analyzeDocument = async (file, targetLanguageName, modelName = 'gemma4:e2b', onProgress = () => {}) => {
  let prompt = '';
  let images = null;

  // Validate file types
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const isImage = validImageTypes.includes(file.type);
  const isPdf = file.type === 'application/pdf';

  if (!isImage && !isPdf) {
    throw new Error('Unsupported file format. Please upload a PDF or an Image (JPG, JPEG, PNG, WEBP).');
  }

  // 1. Process files based on content type
  if (isPdf) {
    const textContent = await extractTextFromPdf(file, modelName, onProgress);
    if (!textContent) {
      throw new Error('The PDF document contains no readable text or image layers.');
    }
    prompt = `Analyze the uploaded document according to the system instructions.

Extracted Document Text Content:
"""
${textContent}
"""

The user has selected the language: ${targetLanguageName}

Generate the translated summary in the selected language.

Return ONLY valid JSON.`;
  } else if (isImage) {
    onProgress('Converting document image...');
    const base64Image = await convertToBase64(file);
    images = [base64Image];
    prompt = `Analyze the uploaded document according to the system instructions.

[Document Image Attached]

The user has selected the language: ${targetLanguageName}

Generate the translated summary in the selected language.

Return ONLY valid JSON.`;
  }

  // 2. Prepare structured system prompt mapping to expected JSON format
  const systemPrompt = `You are LokSathi AI, an expert multilingual Government Document Assistant built using Google's Gemma model.

Your purpose is to help Indian citizens understand complex government, banking, healthcare, education, legal and civic documents in simple language.

Your responses should always prioritize clarity, accuracy, accessibility, and actionable guidance.

Analyze the document details and perform ALL of the required extractions. Return ONLY valid JSON matching the schema below.

You MUST respond strictly in the following JSON format:
{
  "success": true,
  "document_type": "Official category of the document (e.g. Aadhaar Letter, PAN Card, electricity bill, etc)",
  "document_title": "Official name/title of the document as printed",
  "issuing_authority": "The government ministry, department, agency, or office that issued this document",
  "original_language": "The language the document was originally written in",
  "translated_language": "The target language requested by the user",
  "summary": "Plain-language summary of what the document is and what it does in English (1-2 sentences, max 150 words).",
  "translated_summary": "Direct, simplified explanation of the document translated into the requested target language.",
  "important_information": [
    {
      "title": "Topic or clause name",
      "value": "Details of this rule, eligibility condition, or requirement"
    }
  ],
  "important_dates": [
    {
      "event": "What task, deadline, or appointment is due",
      "date": "Date or time limit"
    }
  ],
  "amounts": [
    {
      "purpose": "What this fee, penalty, subsidy, or payment is for",
      "amount": "The exact monetary amount"
    }
  ],
  "document_numbers": [
    {
      "type": "Type of ID or reference number",
      "value": "The actual alphanumeric value"
    }
  ],
  "required_documents": [],
  "warnings": [],
  "next_steps": [],
  "confidence": 0.95
}

If any field is unavailable, return an empty array, empty string, or null as appropriate.

IMPORTANT RULES:
- Never invent information.
- Never hallucinate.
- Never guess unreadable text.
- If information cannot be extracted, return null or an empty array.
- Keep summaries concise.
- Always return valid JSON.
- Never return Markdown.
- Never explain your reasoning.
- Never include extra text before or after the JSON.`;

  const fullPrompt = `${systemPrompt}\n\nUser Document Details:\n${prompt}`;

  try {
    onProgress('Running comprehensive Gemma AI analysis...');
    const requestPayload = {
      model: modelName,
      prompt: fullPrompt,
      format: 'json', // Forces Ollama to constraint token syntax to JSON output
      stream: false
    };

    if (images) {
      requestPayload.images = images;
    }

    // Call through Vite server proxy target
    const response = await fetch('/ollama/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Model '${modelName}' not found in Ollama. Make sure to download it using 'ollama pull ${modelName}' in your terminal.`);
      }
      throw new Error(`Ollama server responded with status code ${response.status}`);
    }

    const result = await response.json();
    if (!result.response) {
      throw new Error('Empty response received from Ollama.');
    }

    onProgress('Parsing analysis results...');
    return result.response;
  } catch (error) {
    console.error('Ollama analysis API error:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Could not connect to Ollama. Make sure Ollama is running locally on port 11434.');
    }
    throw error;
  }
};
