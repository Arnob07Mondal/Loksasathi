/**
 * Image Processor Service
 * Handles base64 conversions and image buffer manipulations.
 */

/**
 * Helper: Converts an image file to a base64 encoded string.
 * 
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 data string (excluding the metadata prefix)
 */
export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => {
      console.error('File read error:', error);
      reject(new Error('Could not convert document image to base64.'));
    };
    reader.readAsDataURL(file);
  });
};
