import { analyze } from './analysisPipeline';

/**
 * Sends document contents to a local Ollama server running gemma4:e2b.
 * Main compatibility facade forwarding calls directly to the refactored analysis pipeline orchestrator.
 * 
 * @param {File} file - PDF or image file (JPG, JPEG, PNG, WEBP)
 * @param {string} targetLanguageName - Target language name (e.g. 'Hindi', 'Bengali')
 * @param {string} modelName - Model name to run on Ollama (default: gemma4:e2b)
 * @param {Function} onProgress - Progress status callback
 * @returns {Promise<string>} Raw JSON text response from the model pipeline
 */
export const analyzeDocument = async (file, targetLanguageName, modelName = 'gemma4:e2b', onProgress = () => {}) => {
  return await analyze(file, targetLanguageName, modelName, onProgress);
};
