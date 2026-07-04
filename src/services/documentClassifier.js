import { ollamaClient } from './ollamaClient';

/**
 * Document Classifier Service
 * Performs PASS 1 of the analysis pipeline: identifies document type, detects language, and transcribes text.
 * 
 * @param {string|null} textContent - Pre-extracted text context if available (e.g. from PDF selectable layers)
 * @param {string[]|null} images - Base64 image array if available for visual classification
 * @param {string} modelName - Model name to target on local Ollama server
 * @returns {Promise<Object>} Object containing { document_type, language, raw_text }
 */
export const classifyDocument = async (textContent, images = null, modelName = 'gemma4:e2b') => {
  const systemPrompt = `You are a strict document parser. Your only task is to classify the document and transcribe its content.
Identify the official document type (e.g. Aadhaar Card, PAN Card, electricity bill, consent form, passport, legal notice, etc.).
Detect the primary language of the document.
Extract every visible word, number, header, title, name, and table verbatim. 

CRITICAL INSTRUCTIONS:
- Never summarize.
- Never translate.
- Never explain your reasoning.
- Never include extra text before or after the JSON.
- Never invent information or guess unreadable text.

Return ONLY a valid JSON object matching this exact schema:
{
  "document_type": "Official category or name of the document",
  "language": "Detected primary language of the document",
  "raw_text": "Verbatim transcription of all text contents extracted from the document"
}`;

  let userPrompt = '';
  if (textContent) {
    userPrompt = `Document text content:\n"""\n${textContent}\n"""`;
  } else {
    userPrompt = `[Document Image Attached]`;
  }

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  const payload = {
    model: modelName,
    prompt: fullPrompt,
    format: 'json',
    stream: false
  };

  if (images) {
    payload.images = images;
  }

  const responseText = await ollamaClient.generate(payload);
  
  try {
    const parsed = JSON.parse(responseText);
    return {
      document_type: parsed.document_type || 'Official Document',
      language: parsed.language || 'English',
      raw_text: parsed.raw_text || textContent || ''
    };
  } catch (error) {
    console.error('Failed to parse Gemma classification output:', responseText, error);
    // Safe fallback mapping
    return {
      document_type: 'Official Document',
      language: 'English',
      raw_text: responseText || textContent || ''
    };
  }
};
