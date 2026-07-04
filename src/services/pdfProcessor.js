/**
 * PDF Processor Service
 * Handles PDF text layer extraction, canvas conversions, and scanned page page-by-page OCR loops.
 */

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
