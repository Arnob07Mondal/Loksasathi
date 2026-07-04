/**
 * Ollama Client Service
 * Manages HTTP connections and JSON payloads directed to the Ollama local daemon.
 */

export const ollamaClient = {
  /**
   * Sends a generation request to the local Ollama API server.
   * 
   * @param {Object} payload - Generation parameters (model, prompt, format, images, stream)
   * @returns {Promise<string>} Generated text response
   */
  generate: async (payload) => {
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
          throw new Error(`Model '${payload.model}' not found in Ollama. Make sure to download it using 'ollama pull ${payload.model}' in your terminal.`);
        }
        throw new Error(`Ollama server responded with status code ${response.status}`);
      }

      const result = await response.json();
      if (!result.response) {
        throw new Error('Empty response received from Ollama.');
      }

      return result.response;
    } catch (error) {
      console.error('Ollama Client generate request failed:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Could not connect to Ollama. Make sure Ollama is running locally on port 11434.');
      }
      throw error;
    }
  }
};
