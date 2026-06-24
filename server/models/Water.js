const mongoose = require('mongoose');

const waterSchema = new mongoose.Schema({
  // Reference to the User who logged this water intake entry.
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Number of liters of water logged in this entry.
  liters: {
    type: Number,
    required: true
  },
  // The date and time when the water intake occurred.
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Water', waterSchema);
