const express = require('express');
const router = express.Router();
const Winner = require('../models/Winner');

// Get all winners
router.get('/', async (req, res) => {
  try {
    let winners = await Winner.find().sort({ season: -1 }); // Latest first
    
    // If no winners in DB, create default entries
    if (winners.length === 0) {
      const defaultWinners = [
        { season: 13, teamName: 'Edara', runnerUp: 'Mutharasupalem', thirdPlace: 'Team C' },
        { season: 12, teamName: 'Mutharasupalem', runnerUp: 'Edara', thirdPlace: 'Team C' },
        { season: 11, teamName: 'Edara', runnerUp: 'Team B', thirdPlace: 'Team C' },
        { season: 10, teamName: 'Mutharasupalem', runnerUp: 'Team B', thirdPlace: 'Team C' },
        { season: 9, teamName: 'V.Appapuram', runnerUp: 'Team B', thirdPlace: 'Team C' },
        { season: 8, teamName: 'MVP Warriors', runnerUp: 'Team B', thirdPlace: 'Team C' },
        { season: 7, teamName: 'Annaram', runnerUp: 'Team B', thirdPlace: 'Team C' },
        { season: 6, teamName: 'Annaram', runnerUp: 'Team B', thirdPlace: 'Team C' },
        { season: 5, teamName: 'Purimetla', runnerUp: 'Team B', thirdPlace: 'Team C' },
        { season: 4, teamName: 'Purimetla', runnerUp: 'Team B', thirdPlace: 'Team C' },
        { season: 3, teamName: 'MVP Warriors', runnerUp: 'Team B', thirdPlace: 'Team C' },
        { season: 2, teamName: 'MVP Warriors', runnerUp: 'Team B', thirdPlace: 'Team C' },
        { season: 1, teamName: 'MVP Warriors', runnerUp: 'Team B', thirdPlace: 'Team C' }
      ];
      
      winners = await Winner.insertMany(defaultWinners);
    }
    
    res.json({ success: true, data: winners });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get winner by season
router.get('/season/:season', async (req, res) => {
  try {
    const winner = await Winner.findOne({ season: parseInt(req.params.season) });
    
    if (!winner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Season winner not found' 
      });
    }
    
    res.json({ success: true, data: winner });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Add new season
router.post('/add', async (req, res) => {
  try {
    const { season, teamName, captain, runnerUp, thirdPlace, highlights, matchDate } = req.body;
    
    // Check if season already exists
    const existingSeason = await Winner.findOne({ season: parseInt(season) });
    if (existingSeason) {
      return res.status(400).json({ 
        success: false, 
        message: `Season ${season} already exists` 
      });
    }
    
    const winner = new Winner({
      season: parseInt(season),
      teamName,
      captain: captain || '',
      runnerUp: runnerUp || '',
      thirdPlace: thirdPlace || '',
      highlights: highlights || '',
      matchDate: matchDate ? new Date(matchDate) : null
    });
    
    await winner.save();
    
    res.status(201).json({ 
      success: true, 
      data: winner,
      message: 'New season added successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Update winner image (from frontend Cloudinary upload)
router.put('/season/:season/image', async (req, res) => {
  try {
    const { imageUrl, cloudinaryId } = req.body;
    const season = parseInt(req.params.season);
    
    const winner = await Winner.findOneAndUpdate(
      { season },
      {
        imageUrl,
        cloudinaryId,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!winner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Season not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: winner,
      message: 'Winner image updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Update winner details
router.put('/season/:season/details', async (req, res) => {
  try {
    const { teamName, captain, runnerUp, thirdPlace, highlights, matchDate } = req.body;
    const season = parseInt(req.params.season);
    
    const winner = await Winner.findOneAndUpdate(
      { season },
      {
        teamName,
        captain,
        runnerUp,
        thirdPlace,
        highlights,
        matchDate: matchDate ? new Date(matchDate) : null,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!winner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Season not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: winner,
      message: 'Winner details updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;