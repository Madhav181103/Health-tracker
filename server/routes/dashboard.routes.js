const express = require('express');
const Meal = require('../models/Meal');
const Workout = require('../models/Workout');
const Water = require('../models/Water');
const Sleep = require('../models/Sleep');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// GET / - Dashboard Today's Stats
router.get('/', authMiddleware, async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const query = {
      userId: req.userId,
      date: { $gte: startOfToday, $lte: endOfToday }
    };

    // Run all 4 queries in parallel
    const [meals, workouts, waterLogs, sleepLogs] = await Promise.all([
      Meal.find(query),
      Workout.find(query),
      Water.find(query),
      Sleep.find(query)
    ]);

    // Calculate today's stats
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    meals.forEach(meal => {
      totalCalories += meal.calories || 0;
      totalProtein += meal.protein || 0;
      totalCarbs += meal.carbs || 0;
      totalFat += meal.fat || 0;
    });

    let caloriesBurned = 0;
    workouts.forEach(workout => {
      caloriesBurned += workout.caloriesBurned || 0;
    });

    let waterLiters = 0;
    waterLogs.forEach(water => {
      waterLiters += water.liters || 0;
    });

    // sleepHours: today's sleep entry hours (or null if none)
    const sleepHours = sleepLogs.length > 0 ? sleepLogs[0].hours : null;

    return res.status(200).json({
      today: {
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        caloriesBurned,
        waterLiters,
        sleepHours
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard aggregation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
