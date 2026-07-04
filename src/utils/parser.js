/**
 * Cleans markdown code blocks from a JSON string if returned by an LLM.
 * e.g., ```json { ... } ``` -> { ... }
 * 
 * @param {string} str - Raw string response from AI
 * @returns {string} Cleaned JSON string
 */
export const cleanJsonString = (str) => {
  if (typeof str !== 'string') return '';
  let cleaned = str.trim();
  
  // Remove starting markdown block wrappers
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  
  // Remove ending markdown block wrappers
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  
  return cleaned.trim();
};

/**
 * Parses the structured JSON output from Gemma 4 E2B.
 * Converts snake_case keys and array of objects into camelCase UI states.
 * 
 * @param {Object|string} response - Raw response object or string from Ollama
 * @param {string} selectedLanguage - User selected language code (e.g. 'hi')
 * @returns {Object} Normal UI-compatible analysis result
 */
export const parseGemmaResponse = (response, selectedLanguage = 'en') => {
  let parsed = {};

  if (typeof response === 'object' && response !== null) {
    parsed = response;
  } else if (typeof response === 'string') {
    try {
      const cleaned = cleanJsonString(response);
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('JSON parsing error:', e, 'Raw string:', response);
      throw new Error('Failed to parse document analysis. The AI response was not in a valid JSON format.');
    }
  }

  // 1. Map Document Type / Title
  const documentType = parsed.document_type || parsed.document_title || parsed.documentType || 'Government Document';
  
  // 2. Map Simplified Summary
  const simplifiedText = parsed.summary || parsed.simplifiedText || 'No explanation summary could be generated.';
  
  // 3. Map Translations
  const translations = parsed.translations || {};
  const translatedSummary = parsed.translated_summary || parsed.translatedSummary;
  if (translatedSummary && !translations[selectedLanguage]) {
    translations[selectedLanguage] = translatedSummary;
  }
  if (!translations[selectedLanguage]) {
    translations[selectedLanguage] = simplifiedText;
  }

  // 4. Consolidate Critical Highlights (importantInfo)
  // We combine: issuing_authority, important_information, amounts, document_numbers, warnings
  const importantInfo = [];

  // Add Issuing Authority
  if (parsed.issuing_authority) {
    importantInfo.push(`**Issuing Authority**: ${parsed.issuing_authority}`);
  }

  // Add Original Language Info if not English
  if (parsed.original_language && parsed.original_language.toLowerCase() !== 'english') {
    importantInfo.push(`**Original Language**: Detected ${parsed.original_language}`);
  }

  // Add structured important information
  const importantInfoRaw = parsed.important_information || parsed.importantInfo;
  if (Array.isArray(importantInfoRaw)) {
    importantInfoRaw.forEach((info) => {
      if (typeof info === 'object' && info !== null && info.title) {
        importantInfo.push(`**${info.title}**: ${info.value || ''}`);
      } else if (typeof info === 'string') {
        importantInfo.push(info);
      }
    });
  }

  // Add warnings
  const warningsRaw = parsed.warnings || [];
  if (Array.isArray(warningsRaw)) {
    warningsRaw.forEach((warn) => {
      if (typeof warn === 'string') {
        importantInfo.push(`**Warning**: ${warn}`);
      }
    });
  }

  // Add document reference numbers
  const docNumbersRaw = parsed.document_numbers || parsed.documentNumbers || [];
  if (Array.isArray(docNumbersRaw)) {
    docNumbersRaw.forEach((num) => {
      if (typeof num === 'object' && num !== null && num.type) {
        importantInfo.push(`**Document Number (${num.type})**: ${num.value || ''}`);
      }
    });
  }

  // Add fee/monetary amounts
  const amountsRaw = parsed.amounts || [];
  if (Array.isArray(amountsRaw)) {
    amountsRaw.forEach((amt) => {
      if (typeof amt === 'object' && amt !== null && amt.purpose) {
        importantInfo.push(`**Amount for ${amt.purpose}**: ${amt.amount || ''}`);
      }
    });
  }

  // 5. Map Deadlines (UI expects id, action, date, priority, completed)
  const deadlinesRaw = parsed.important_dates || parsed.deadlines || [];
  const deadlines = Array.isArray(deadlinesRaw)
    ? deadlinesRaw.map((dl, index) => {
        // expected json deadline elements are [{ event, date }] or [{ date, action, priority }]
        const action = dl.event || dl.action || 'Required action';
        const date = dl.date || 'Refer to document';
        const priority = ['high', 'medium', 'low'].includes(dl.priority?.toLowerCase()) 
          ? dl.priority.toLowerCase() 
          : 'medium';
        return {
          id: dl.id || `dl-${index}-${Date.now()}`,
          action,
          date,
          priority,
          completed: !!dl.completed
        };
      })
    : [];

  // 6. Map Required Documents (UI expects id, name, purpose, status)
  const requiredDocsRaw = parsed.required_documents || parsed.requiredDocs || [];
  const requiredDocs = Array.isArray(requiredDocsRaw)
    ? requiredDocsRaw.map((doc, index) => {
        // expected documents are array of strings or objects [{ name, purpose }]
        if (typeof doc === 'object' && doc !== null) {
          return {
            id: doc.id || `rd-${index}-${Date.now()}`,
            name: doc.name || 'Proof document',
            purpose: doc.purpose || 'Verification',
            status: doc.status === 'have' ? 'have' : 'needed'
          };
        }
        return {
          id: `rd-${index}-${Date.now()}`,
          name: typeof doc === 'string' ? doc : 'Proof document',
          purpose: 'Required for submission',
          status: 'needed'
        };
      })
    : [];

  // 7. Map Next Steps / Action Plan (UI expects step, title, description, checklist)
  const nextStepsRaw = parsed.next_steps || parsed.actionPlan || [];
  const actionPlan = Array.isArray(nextStepsRaw)
    ? nextStepsRaw.map((step, index) => {
        // expected steps are array of strings or objects [{ step, title, description, checklist }]
        if (typeof step === 'object' && step !== null) {
          return {
            step: typeof step.step === 'number' ? step.step : index + 1,
            title: step.title || step.event || `Step ${index + 1}`,
            description: step.description || '',
            checklist: Array.isArray(step.checklist) ? step.checklist : []
          };
        }
        return {
          step: index + 1,
          title: typeof step === 'string' ? step : `Step ${index + 1}`,
          description: '',
          checklist: []
        };
      })
    : [];

  return {
    documentType,
    simplifiedText,
    translations,
    importantInfo,
    deadlines,
    requiredDocs,
    actionPlan
  };
};
