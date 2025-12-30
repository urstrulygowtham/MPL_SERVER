const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['title', 'runner-up', 'third', 'post-match'],
    required: true
  },
  awardName: {
    type: String,
    required: true
  },
  sponsorName: {
    type: String,
    required: true
  },
  sponsorDetails: {
    type: String,
    default: ''
  },
  priority: {
    type: Number,
    default: 1,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
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

// Update timestamp on save
sponsorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Sponsor', sponsorSchema);