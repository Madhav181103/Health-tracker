const express = require('express');
const Meal = require('../models/Meal');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// POST / - Log a meal
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat, mealType, date } = req.body;

    // Validate required fields
    if (!name || calories === undefined || !mealType) {
      return res.status(400).json({ message: 'Name, calories, and mealType are required' });
    }

    // Validate mealType enum
    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    if (!validMealTypes.includes(mealType)) {
      return res.status(400).json({ message: 'mealType must be breakfast, lunch, dinner, or snack' });
    }

    const newMeal = new Meal({
      userId: req.userId,
      name,
      calories,
      protein,
      carbs,
      fat,
      mealType,
      date: date || undefined
    });

    const savedMeal = await newMeal.save();
    return res.status(201).json(savedMeal);
  } catch (error) {
    console.error('Error logging meal:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET / - Get meals
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;
    const query = { userId: req.userId };
    let limit = 0;

    if (date) {
      const startOfDay = new Date(date);
      if (isNaN(startOfDay.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else {
      limit = 30;
    }

    const meals = await Meal.find(query)
      .sort({ date: -1 })
      .limit(limit);

    return res.status(200).json(meals);
  } catch (error) {
    console.error('Error getting meals:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /:id - Delete a meal
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMeal = await Meal.findOneAndDelete({ _id: id, userId: req.userId });

    if (!deletedMeal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    return res.status(200).json({ message: 'Meal deleted' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
