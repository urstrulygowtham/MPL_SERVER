const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock database for live score links
let liveScoreLinks = [
  {
    id: 1,
    title: 'Season 14 Opening Match',
    url: 'https://cricheroes.com/mpl-season14',
    description: 'Watch live scores and updates',
    matchType: 'upcoming',
    season: 14,
    date: '2024-02-15',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 2,
    title: 'MPL All-Time Records',
    url: 'https://cricheroes.com/mpl-records',
    description: 'View player statistics and records',
    matchType: 'records',
    season: 'all',
    date: '2024-02-10',
    isActive: true,
    createdAt: new Date()
  }
];

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid token' });
  }
};

// Get all live score links
router.get('/', (req, res) => {
  const activeLinks = liveScoreLinks.filter(link => link.isActive);
  res.json({ 
    success: true, 
    data: activeLinks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  });
});

// Add new live score link
router.post('/', verifyAdmin, (req, res) => {
  try {
    const { title, url, description, matchType, season, date } = req.body;
    
    if (!title || !url) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and URL are required' 
      });
    }

    if (!url.includes('cricheroes.com')) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL must be from CricHeroes domain' 
      });
    }

    const newLink = {
      id: liveScoreLinks.length + 1,
      title,
      url,
      description: description || '',
      matchType: matchType || 'upcoming',
      season: season || 14,
      date: date || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    liveScoreLinks.push(newLink);
    
    res.status(201).json({ 
      success: true, 
      data: newLink,
      message: 'Live score link added successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Update live score link
router.put('/:id', verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, description, matchType, season, date, isActive } = req.body;
    
    const linkIndex = liveScoreLinks.findIndex(link => link.id === parseInt(id));
    
    if (linkIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Live score link not found' 
      });
    }

    if (url && !url.includes('cricheroes.com')) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL must be from CricHeroes domain' 
      });
    }

    liveScoreLinks[linkIndex] = {
      ...liveScoreLinks[linkIndex],
      title: title || liveScoreLinks[linkIndex].title,
      url: url || liveScoreLinks[linkIndex].url,
      description: description !== undefined ? description : liveScoreLinks[linkIndex].description,
      matchType: matchType || liveScoreLinks[linkIndex].matchType,
      season: season || liveScoreLinks[linkIndex].season,
      date: date !== undefined ? date : liveScoreLinks[linkIndex].date,
      isActive: isActive !== undefined ? isActive : liveScoreLinks[linkIndex].isActive,
      updatedAt: new Date()
    };

    res.json({ 
      success: true, 
      data: liveScoreLinks[linkIndex],
      message: 'Live score link updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Delete live score link
router.delete('/:id', verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const linkIndex = liveScoreLinks.findIndex(link => link.id === parseInt(id));
    
    if (linkIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Live score link not found' 
      });
    }

    liveScoreLinks.splice(linkIndex, 1);
    
    res.json({ 
      success: true, 
      message: 'Live score link deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;