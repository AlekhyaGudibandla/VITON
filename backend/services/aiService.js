const axios = require('axios');
const FormData = require('form-data');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5000';

/**
 * Send images to the AI service for virtual try-on generation
 * @param {Buffer} userImageBuffer - User photo buffer
 * @param {Buffer} clothingImageBuffer - Clothing image buffer
 * @returns {Promise<Buffer>} Generated try-on image buffer
 */
async function generateTryOn(userImageBuffer, clothingImageBuffer) {
  try {
    const formData = new FormData();
    formData.append('user_image', userImageBuffer, {
      filename: 'user_image.jpg',
      contentType: 'image/jpeg'
    });
    formData.append('clothing_image', clothingImageBuffer, {
      filename: 'clothing_image.jpg',
      contentType: 'image/jpeg'
    });

    const response = await axios.post(`${AI_SERVICE_URL}/api/tryon`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      responseType: 'arraybuffer',
      timeout: 120000 // 2 minute timeout for AI processing
    });

    return Buffer.from(response.data, 'binary');
  } catch (error) {
    if (error.response) {
      let errorText = '';
      if (Buffer.isBuffer(error.response.data)) {
        errorText = error.response.data.toString('utf-8');
      } else if (typeof error.response.data === 'object') {
        errorText = JSON.stringify(error.response.data);
      } else {
        errorText = error.response.data;
      }
      throw new Error(`AI Service error: ${errorText}`);
    }
    throw new Error(`AI Service unreachable: ${error.message}`);
  }
}

/**
 * Check if the AI service is healthy
 */
async function checkHealth() {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/health`, {
      timeout: 5000
    });
    return response.data;
  } catch {
    return { status: 'unavailable' };
  }
}

module.exports = {
  generateTryOn,
  checkHealth
};
