import { ollamaClient } from './ollamaClient';

/**
 * Document Analyzer Service
 * Performs PASS 2 of the analysis pipeline: reasons over classified raw text content to extract details.
 * 
 * @param {string} documentType - Classified document category (from Pass 1)
 * @param {string} rawText - Verbatim transcribed text content (from Pass 1)
 * @param {string} targetLanguageName - Target language name for translation (e.g. 'Hindi')
 * @param {string} modelName - Model name to target on local Ollama server
 * @returns {Promise<string>} Structured JSON output text matching the final client schema
 */
export const analyzeDocumentContent = async (documentType, rawText, targetLanguageName, modelName = 'gemma4:e2b') => {
  const systemPrompt = `You are LokSathi AI, an expert multilingual Government Document Assistant built using Google's Gemma model.

Your purpose is to help Indian citizens understand complex government, banking, healthcare, education, legal and civic documents in simple language.

Your responses should always prioritize clarity, accuracy, accessibility, and actionable guidance.

Analyze the provided document type and raw text verbatim, and perform ALL of the required extractions. Return ONLY valid JSON matching the schema below.

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

  const userPrompt = `Document Category: ${documentType}
Document Verbatim Text:
"""
${rawText}
"""

The user has selected the translation language: ${targetLanguageName}

Generate the translated summary in the selected language.

Return ONLY valid JSON.`;

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  const payload = {
    model: modelName,
    prompt: fullPrompt,
    format: 'json',
    stream: false
  };

  return await ollamaClient.generate(payload);
};
