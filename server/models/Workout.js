const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  // Reference to the User who logged this workout.
  // Using an ObjectId reference ('ref: User') instead of storing the user's name directly:
  // 1. Referential Integrity: It establishes a clean relationship to the User model, allowing populating User details via Mongoose populate().
  // 2. Normalization: If the user changes their name or email, we don't have to update it across thousands of workout logs.
  // 3. Efficiency & Uniqueness: User names can be duplicates, whereas the ObjectId is unique, indexing is faster, and it reduces document size.
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The type of workout (e.g., 'Running', 'Gym', 'Cycling', 'Swimming').
  type: {
    type: String,
    required: true
  },
  // The duration of the workout in minutes.
  duration: {
    type: Number,
    required: true
  },
  // Estimated calories burned during the workout (optional).
  caloriesBurned: {
    type: Number
  },
  // Optional extra notes about the workout.
  notes: {
    type: String
  },
  // The date when the workout occurred.
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workout', workoutSchema);
