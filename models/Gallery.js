const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['matches', 'winners', 'ceremony', 'teams', 'general'],
    default: 'general'
  },
  season: {
    type: Number,
    min: 1,
    max: 13
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: String,
    default: 'admin'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);