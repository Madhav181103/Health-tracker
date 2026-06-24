const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema({
  // Reference to the User who logged this sleep entry.
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Number of hours the user slept (required).
  hours: {
    type: Number,
    required: true
  },
  // Sleep quality score ranging from 1 (Poor) to 5 (Excellent).
  quality: {
    type: Number,
    min: 1,
    max: 5
  },
  // The date and time for the sleep entry.
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sleep', sleepSchema);
