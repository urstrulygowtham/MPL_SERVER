const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  season: {
    type: Number,
    required: true,
    unique: true,
    min: 1
  },
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  captain: {
    type: String,
    trim: true,
    default: ''
  },
  runnerUp: {
    type: String,
    trim: true,
    default: ''
  },
  thirdPlace: {
    type: String,
    trim: true,
    default: ''
  },
  imageUrl: {
    type: String,
    trim: true
  },
  cloudinaryId: {
    type: String,
    trim: true
  },
  matchDate: {
    type: Date
  },
  highlights: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
winnerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Winner', winnerSchema);