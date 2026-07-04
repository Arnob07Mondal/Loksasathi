import { convertToBase64 } from './imageProcessor';
import { extractTextFromPdf } from './pdfProcessor';
import { ollamaClient } from './ollamaClient';





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

    const responseText = await ollamaClient.generate(requestPayload);
    onProgress('Parsing analysis results...');
    return responseText;
  } catch (error) {
    console.error('Ollama analysis API error:', error);
    throw error;
  }
};
