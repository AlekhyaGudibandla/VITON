const express = require('express');
const router = express.Router();
const { supabase } = require('../services/supabaseService');
const authMiddleware = require('../middleware/auth');

/**
 * Image proxy endpoint — serves images from Supabase Storage directly.
 * This avoids CORS issues and works regardless of bucket visibility settings.
 * 
 * GET /api/images/:bucket/:userId/:fileName
 */
router.get('/:bucket/:userId/:fileName', async (req, res) => {
  try {
    const { bucket, userId, fileName } = req.params;

    // Validate bucket name
    const allowedBuckets = ['user-photos', 'clothing-images', 'tryon-results'];
    if (!allowedBuckets.includes(bucket)) {
      return res.status(400).json({ error: 'Invalid bucket' });
    }

    const filePath = `${userId}/${fileName}`;

    // Download from Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePath);

    if (error) {
      console.error('Image proxy download error:', error);
      return res.status(404).json({ error: 'Image not found' });
    }

    // Convert Blob to Buffer
    const buffer = Buffer.from(await data.arrayBuffer());

    // Determine content type from filename
    const ext = fileName.split('.').pop()?.toLowerCase();
    const contentTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };
    const contentType = contentTypes[ext] || 'image/jpeg';

    // Set cache headers (1 hour)
    res.set({
      'Content-Type': contentType,
      'Content-Length': buffer.length,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    });

    res.send(buffer);
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

module.exports = router;
