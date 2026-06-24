const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  // Reference to the User who logged this meal.
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The name of the meal (e.g. 'Paneer Paratha', 'Protein Shake').
  name: {
    type: String,
    required: true
  },
  // Total calories in the meal (kcal).
  calories: {
    type: Number,
    required: true
  },
  // Protein content in grams (optional).
  protein: {
    type: Number
  },
  // Carbohydrate content in grams (optional).
  carbs: {
    type: Number
  },
  // Fat content in grams (optional).
  fat: {
    type: Number
  },
  // Type of meal. Must be 'breakfast', 'lunch', 'dinner', or 'snack'.
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  // The date and time when the meal occurred.
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Meal', mealSchema);
