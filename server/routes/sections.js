const express = require('express');
const router = express.Router();
const WebsiteSection = require('../models/WebsiteSection');

// Public route to get active sections
router.get('/', async (req, res) => {
  try {
    const { key, type } = req.query;
    const query = { isActive: true };
    
    if (key) {
      query.sectionKey = key;
    }
    
    if (type) {
      query.sectionType = type;
    }
    
    const sections = await WebsiteSection.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    res.json({ sections: sections || [] });
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ message: 'Failed to fetch sections', error: error.message });
  }
});

// Get single section by key
router.get('/:key', async (req, res) => {
  try {
    const section = await WebsiteSection.findOne({ 
      sectionKey: req.params.key,
      isActive: true 
    });
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    res.json(section);
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({ message: 'Failed to fetch section', error: error.message });
  }
});

module.exports = router;

