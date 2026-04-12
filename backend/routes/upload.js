const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const { uploadToStorage, getProxyUrl, insertRecord } = require('../services/supabaseService');
const axios = require('axios');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept all common image formats
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp',
      'image/gif', 'image/bmp', 'image/tiff',
      'image/avif', 'image/heic', 'image/heif'
    ];
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, PNG, WebP, etc.)'));
    }
  }
});

// POST /api/upload/user-image
router.post('/user-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const userId = req.user.id;
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;

    await uploadToStorage('user-photos', fileName, req.file.buffer, req.file.mimetype);
    const imageUrl = getProxyUrl('user-photos', fileName);

    const record = await insertRecord('images', {
      user_id: userId,
      image_type: 'user',
      storage_path: fileName,
      original_filename: req.file.originalname,
      file_size_bytes: req.file.size,
      mime_type: req.file.mimetype
    });

    res.status(201).json({
      message: 'User image uploaded successfully',
      image: { ...record, url: imageUrl }
    });
  } catch (error) {
    console.error('Upload user image error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/upload/clothing-image
router.post('/clothing-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const userId = req.user.id;
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;

    await uploadToStorage('clothing-images', fileName, req.file.buffer, req.file.mimetype);
    const imageUrl = getProxyUrl('clothing-images', fileName);

    const record = await insertRecord('images', {
      user_id: userId,
      image_type: 'clothing',
      storage_path: fileName,
      original_filename: req.file.originalname,
      file_size_bytes: req.file.size,
      mime_type: req.file.mimetype
    });

    res.status(201).json({
      message: 'Clothing image uploaded successfully',
      image: { ...record, url: imageUrl }
    });
  } catch (error) {
    console.error('Upload clothing image error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/upload/clothing-url
router.post('/clothing-url', authMiddleware, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Download image from URL
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const contentType = response.headers['content-type'] || 'image/jpeg';
    const buffer = Buffer.from(response.data);

    // Validate it's actually an image
    if (!contentType.startsWith('image/')) {
      return res.status(400).json({ error: 'URL does not point to a valid image' });
    }

    const userId = req.user.id;
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    const fileName = `${userId}/${uuidv4()}.${ext}`;

    await uploadToStorage('clothing-images', fileName, buffer, contentType);
    const imageUrl = getProxyUrl('clothing-images', fileName);

    const record = await insertRecord('images', {
      user_id: userId,
      image_type: 'clothing',
      storage_path: fileName,
      original_filename: `clothing-from-url.${ext}`,
      file_size_bytes: buffer.length,
      mime_type: contentType
    });

    res.status(201).json({
      message: 'Clothing image fetched and stored successfully',
      image: { ...record, url: imageUrl }
    });
  } catch (error) {
    console.error('Fetch clothing URL error:', error);
    const msg = error.response
      ? `Failed to fetch image from URL (status ${error.response.status})`
      : error.message;
    res.status(500).json({ error: msg });
  }
});

module.exports = router;
