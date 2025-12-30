const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const { category, season, limit = 50 } = req.query;
    
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (season) query.season = parseInt(season);
    
    const images = await Gallery.find(query)
      .sort({ uploadedAt: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Add new gallery image (from frontend Cloudinary upload)
router.post('/add', async (req, res) => {
  try {
    const { title, imageUrl, category, season, cloudinaryId } = req.body;
    
    const image = new Gallery({
      title: title || 'Untitled',
      imageUrl,
      category: category || 'general',
      season: season ? parseInt(season) : null,
      cloudinaryId,
      uploadedBy: 'admin'
    });
    
    await image.save();
    
    res.status(201).json({ 
      success: true, 
      data: image,
      message: 'Image added to gallery successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Delete gallery image
router.delete('/:id', async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    
    if (!image) {
      return res.status(404).json({ 
        success: false, 
        message: 'Image not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Image deleted from gallery' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;