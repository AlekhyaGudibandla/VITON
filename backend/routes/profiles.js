const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const { 
  uploadToStorage, 
  getProxyUrl, 
  insertRecord, 
  getRecords, 
  getRecord, 
  updateRecord, 
  deleteFromStorage,
  supabase
} = require('../services/supabaseService');

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// GET /api/profiles - Fetch all profiles for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const profiles = await getRecords('profiles', { user_id: userId }, 'created_at', false);
    
    // Add public URLs to profiles
    const enhancedProfiles = profiles.map(p => ({
      ...p,
      url: getProxyUrl('profiles', p.storage_path)
    }));
    
    res.json({ profiles: enhancedProfiles });
  } catch (error) {
    console.error('Fetch profiles error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/profiles - Create new profile
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ error: 'Name and image are required' });
    }

    const userId = req.user.id;
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;

    // Upload to 'profiles' bucket
    await uploadToStorage('profiles', fileName, req.file.buffer, req.file.mimetype);
    
    const record = await insertRecord('profiles', {
      user_id: userId,
      name,
      storage_path: fileName,
    });

    res.status(201).json({
      message: 'Profile created successfully',
      profile: { ...record, url: getProxyUrl('profiles', fileName) }
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/profiles/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const profileId = req.params.id;
    
    const profile = await getRecord('profiles', profileId);
    if (!profile || profile.user_id !== userId) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Delete image from storage
    try {
      await deleteFromStorage('profiles', profile.storage_path);
    } catch (storageErr) {
      console.warn('Storage deletion failed (might already be gone):', storageErr.message);
    }

    // Delete record from DB
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profileId);

    if (error) throw error;

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
