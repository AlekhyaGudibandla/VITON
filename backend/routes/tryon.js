const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const {
  uploadToStorage,
  getProxyUrl,
  insertRecord,
  updateRecord,
  getRecords,
  getRecord
} = require('../services/supabaseService');
const { generateTryOn, checkHealth } = require('../services/aiService');
const { supabase } = require('../services/supabaseService');

// POST /api/tryon/generate
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { userImageId, clothingImageId, profileId } = req.body;
    const userId = req.user.id;

    if ((!userImageId && !profileId) || !clothingImageId) {
      return res.status(400).json({ error: 'Profile or User image ID, and clothing image ID are required' });
    }

    let userImage;
    let userBucket = 'user-photos';

    if (profileId) {
      // Get from profiles table
      userImage = await getRecord('profiles', profileId);
      userBucket = 'profiles';
    } else {
      // Get from images table (old way)
      userImage = await getRecord('images', userImageId);
      userBucket = 'user-photos';
    }

    const clothingImage = await getRecord('images', clothingImageId);

    if (!userImage || userImage.user_id !== userId) {
      return res.status(404).json({ error: 'Base image/profile not found' });
    }
    if (!clothingImage || clothingImage.user_id !== userId) {
      return res.status(404).json({ error: 'Clothing image not found' });
    }

    // Create try-on request record
    const tryonRecord = await insertRecord('tryon_requests', {
      user_id: userId,
      user_image_id: userImageId || null,
      profile_id: profileId || null,
      clothing_image_id: clothingImageId,
      status: 'processing'
    });

    const startTime = Date.now();

    try {
      // Download images from Supabase Storage
      const { data: userImgData, error: userDlErr } = await supabase.storage
        .from(userBucket)
        .download(userImage.storage_path);

      if (userDlErr) throw new Error(`Failed to download base image: ${userDlErr.message}`);

      const { data: clothingImgData, error: clothDlErr } = await supabase.storage
        .from('clothing-images')
        .download(clothingImage.storage_path);

      if (clothDlErr) throw new Error(`Failed to download clothing image: ${clothDlErr.message}`);

      const userBuffer = Buffer.from(await userImgData.arrayBuffer());
      const clothingBuffer = Buffer.from(await clothingImgData.arrayBuffer());

      // Send to AI service
      const resultBuffer = await generateTryOn(userBuffer, clothingBuffer);

      // Store result
      const resultPath = `${userId}/${uuidv4()}.jpg`;
      await uploadToStorage('tryon-results', resultPath, resultBuffer, 'image/jpeg');
      const resultUrl = getProxyUrl('tryon-results', resultPath);

      const processingTime = Date.now() - startTime;

      // Update record
      const updatedRecord = await updateRecord('tryon_requests', tryonRecord.id, {
        result_storage_path: resultPath,
        status: 'completed',
        processing_time_ms: processingTime
      });

      // Get image URLs
      const userImageUrl = getProxyUrl(userBucket, userImage.storage_path);
      const clothingImageUrl = getProxyUrl('clothing-images', clothingImage.storage_path);

      res.json({
        message: 'Try-on generated successfully',
        result: {
          ...updatedRecord,
          result_url: resultUrl,
          user_image_url: userImageUrl,
          clothing_image_url: clothingImageUrl
        }
      });
    } catch (aiError) {
      await updateRecord('tryon_requests', tryonRecord.id, {
        status: 'failed',
        error_message: aiError.message,
        processing_time_ms: Date.now() - startTime
      });
      throw aiError;
    }
  } catch (error) {
    console.error('Generate try-on error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tryon/result/:id
router.get('/result/:id', authMiddleware, async (req, res) => {
  try {
    const record = await getRecord('tryon_requests', req.params.id);

    if (!record || record.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Try-on result not found' });
    }

    // Get image records and URLs
    const userImage = await getRecord('images', record.user_image_id);
    const clothingImage = await getRecord('images', record.clothing_image_id);

    const userImageUrl = userImage ? getProxyUrl('user-photos', userImage.storage_path) : null;
    const clothingImageUrl = clothingImage ? getProxyUrl('clothing-images', clothingImage.storage_path) : null;
    const resultUrl = record.result_storage_path
      ? getProxyUrl('tryon-results', record.result_storage_path)
      : null;

    res.json({
      result: {
        ...record,
        result_url: resultUrl,
        user_image_url: userImageUrl,
        clothing_image_url: clothingImageUrl
      }
    });
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tryon/history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const records = await getRecords('tryon_requests', { user_id: req.user.id });

    const results = await Promise.all(
      records.map(async (record) => {
        try {
          const clothingImage = await getRecord('images', record.clothing_image_id);

          let userImageUrl = null;
          if (record.profile_id) {
            const profile = await getRecord('profiles', record.profile_id);
            if (profile) userImageUrl = getProxyUrl('profiles', profile.storage_path);
          } else if (record.user_image_id) {
            const userImage = await getRecord('images', record.user_image_id);
            if (userImage) userImageUrl = getProxyUrl('user-photos', userImage.storage_path);
          }
          const clothingImageUrl = clothingImage
            ? getProxyUrl('clothing-images', clothingImage.storage_path)
            : null;
          const resultUrl = record.result_storage_path
            ? getProxyUrl('tryon-results', record.result_storage_path)
            : null;

          return {
            ...record,
            result_url: resultUrl,
            user_image_url: userImageUrl,
            clothing_image_url: clothingImageUrl
          };
        } catch {
          return {
            ...record,
            result_url: null,
            user_image_url: null,
            clothing_image_url: null
          };
        }
      })
    );

    res.json({ history: results });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tryon/ai-health
router.get('/ai-health', async (req, res) => {
  const health = await checkHealth();
  res.json(health);
});

module.exports = router;
