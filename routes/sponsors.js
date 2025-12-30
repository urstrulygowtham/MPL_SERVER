const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Sponsor = require('../models/Sponsor');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Initialize default sponsors
const initializeSponsors = async () => {
  try {
    const count = await Sponsor.countDocuments();
    if (count === 0) {
      const defaultSponsors = [
        { 
          type: 'title', 
          awardName: 'Title Sponsor',
          sponsorName: 'Sri Nakka Nagireddy Garu (Nuzendla Mandal, YSRCP Ex-Convener)',
          sponsorDetails: 'Principal sponsor of MPL',
          priority: 1,
          isActive: true
        },
        { 
          type: 'runner-up', 
          awardName: 'Runner-up Sponsor',
          sponsorName: 'Acropolix Technologies Pvt. Ltd. Kukatpally, Hyderabad',
          sponsorDetails: 'Sponsor for runner-up team',
          priority: 2,
          isActive: true
        },
        { 
          type: 'third', 
          awardName: 'Third Prize Sponsor',
          sponsorName: 'Janardhana traders Edara (Kondaru Srinivasa Rao garu)',
          sponsorDetails: 'Sponsor for third place team',
          priority: 3,
          isActive: true
        },
        {
          type: 'post-match',
          awardName: 'Player of the Match',
          sponsorName: 'To be announced',
          priority: 4,
          isActive: true
        },
        {
          type: 'post-match',
          awardName: 'Catch of the Match',
          sponsorName: 'To be announced',
          priority: 5,
          isActive: true
        },
        {
          type: 'post-match',
          awardName: 'Six of the Match',
          sponsorName: 'To be announced',
          priority: 6,
          isActive: true
        },
        {
          type: 'post-match',
          awardName: 'Star Performer – Bowler',
          sponsorName: 'To be announced',
          priority: 7,
          isActive: true
        },
        {
          type: 'post-match',
          awardName: 'Star Performer – Batsman',
          sponsorName: 'To be announced',
          priority: 8,
          isActive: true
        },
        {
          type: 'post-match',
          awardName: 'Best Batsman of the Match',
          sponsorName: 'To be announced',
          priority: 9,
          isActive: true
        },
        {
          type: 'post-match',
          awardName: 'Best Bowler of the Match',
          sponsorName: 'To be announced',
          priority: 10,
          isActive: true
        },
        {
          type: 'post-match',
          awardName: 'Best Partnership',
          sponsorName: 'To be announced',
          priority: 11,
          isActive: true
        },
        {
          type: 'post-match',
          awardName: 'Best Striker of the Match',
          sponsorName: 'To be announced',
          priority: 12,
          isActive: true
        },
        {
          type: 'post-match',
          awardName: 'Best Economy Bowler',
          sponsorName: 'To be announced',
          priority: 13,
          isActive: true
        }
      ];

      await Sponsor.insertMany(defaultSponsors);
      console.log('Default sponsors initialized');
    }
  } catch (error) {
    console.error('Error initializing sponsors:', error);
  }
};

// Initialize on startup
initializeSponsors();

// Get all sponsors
router.get('/', async (req, res) => {
  try {
    const sponsors = await Sponsor.find({ isActive: true }).sort('priority');
    res.json({ success: true, data: sponsors });
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update sponsors (Admin only)
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { sponsors } = req.body;

    if (!Array.isArray(sponsors)) {
      return res.status(400).json({ success: false, message: 'Invalid data format' });
    }

    // Update all sponsors
    const updatePromises = sponsors.map(async (sponsor, index) => {
      if (sponsor._id) {
        // Update existing sponsor
        return Sponsor.findByIdAndUpdate(
          sponsor._id,
          { ...sponsor, priority: index + 1 },
          { new: true, upsert: true }
        );
      } else {
        // Create new sponsor
        return Sponsor.create({
          ...sponsor,
          priority: index + 1
        });
      }
    });

    await Promise.all(updatePromises);

    // Get updated list
    const updatedSponsors = await Sponsor.find({ isActive: true }).sort('priority');

    res.json({ 
      success: true, 
      data: updatedSponsors, 
      message: 'Sponsors updated successfully' 
    });
  } catch (error) {
    console.error('Error updating sponsors:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin login (using your existing admin password)
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;

    // Use your existing password from AdminLogin
    const ADMIN_PASSWORD = '22761A05G7'; // Your existing password

    if (password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({
        success: true,
        token,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Token valid' });
});

module.exports = router;