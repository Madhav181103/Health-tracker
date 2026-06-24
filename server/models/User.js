const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // The user's full name.
  name: {
    type: String,
    required: true,
    trim: true
  },
  // The user's unique email address, stored in lowercase and trimmed.
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  // The user's password, stored as a secure bcrypt hash.
  password: {
    type: String,
    required: true
  },
  // The fitness goal of the user. Must be 'lose', 'maintain', or 'gain'.
  goal: {
    type: String,
    enum: ['lose', 'maintain', 'gain'],
    default: 'maintain'
  },
  // The target weight in kg the user wants to reach (optional).
  targetWeight: {
    type: Number
  },
  // The user's target calorie intake per day.
  dailyCalorieTarget: {
    type: Number,
    default: 2000
  },
  // The date and time when the user profile was created.
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
