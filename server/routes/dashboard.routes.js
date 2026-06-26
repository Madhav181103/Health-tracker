const express = require('express');
const Meal = require('../models/Meal');
const Workout = require('../models/Workout');
const Water = require('../models/Water');
const Sleep = require('../models/Sleep');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// GET / - Dashboard Today's and Weekly Stats + Streak
router.get('/', authMiddleware, async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfWeekly = new Date(startOfToday);
    startOfWeekly.setDate(startOfToday.getDate() - 6);

    // Fetch all needed data in parallel
    const [weeklyMeals, weeklyWorkouts, waterLogs, sleepLogs, allWorkouts] = await Promise.all([
      Meal.find({ userId: req.userId, date: { $gte: startOfWeekly, $lte: endOfToday } }),
      Workout.find({ userId: req.userId, date: { $gte: startOfWeekly, $lte: endOfToday } }),
      Water.find({ userId: req.userId, date: { $gte: startOfToday, $lte: endOfToday } }),
      Sleep.find({ userId: req.userId, date: { $gte: startOfToday, $lte: endOfToday } }),
      Workout.find({ userId: req.userId }).sort({ date: -1 })
    ]);

    // 1. Calculate today's stats
    const todayMeals = weeklyMeals.filter(meal => {
      const mDate = new Date(meal.date);
      return mDate >= startOfToday && mDate <= endOfToday;
    });

    const todayWorkouts = weeklyWorkouts.filter(workout => {
      const wDate = new Date(workout.date);
      return wDate >= startOfToday && wDate <= endOfToday;
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    todayMeals.forEach(meal => {
      totalCalories += meal.calories || 0;
      totalProtein += meal.protein || 0;
      totalCarbs += meal.carbs || 0;
      totalFat += meal.fat || 0;
    });

    let caloriesBurned = 0;
    todayWorkouts.forEach(workout => {
      caloriesBurned += workout.caloriesBurned || 0;
    });

    let waterLiters = 0;
    waterLogs.forEach(water => {
      waterLiters += water.liters || 0;
    });

    const sleepHours = sleepLogs.length > 0 ? sleepLogs[0].hours : null;

    // 2. Calculate weekly stats
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const dStart = new Date(startOfToday);
      dStart.setDate(startOfToday.getDate() - i);
      const dEnd = new Date(dStart);
      dEnd.setHours(23, 59, 59, 999);
      days.push({
        start: dStart,
        end: dEnd,
        label: dStart.toLocaleDateString('en-US', { weekday: 'short' }),
        calories: 0,
        workoutMinutes: 0
      });
    }

    weeklyMeals.forEach(meal => {
      const mealTime = new Date(meal.date).getTime();
      const day = days.find(d => mealTime >= d.start.getTime() && mealTime <= d.end.getTime());
      if (day) {
        day.calories += meal.calories || 0;
      }
    });

    weeklyWorkouts.forEach(workout => {
      const workoutTime = new Date(workout.date).getTime();
      const day = days.find(d => workoutTime >= d.start.getTime() && workoutTime <= d.end.getTime());
      if (day) {
        day.workoutMinutes += workout.duration || 0;
      }
    });

    const weekly = {
      labels: days.map(d => d.label),
      calories: days.map(d => d.calories),
      workoutMinutes: days.map(d => d.workoutMinutes)
    };

    // 3. Calculate current workout streak
    let currentStreak = 0;
    const dateHasWorkout = (d) => {
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      return allWorkouts.some(w => {
        const wDate = new Date(w.date);
        return wDate >= start && wDate <= end;
      });
    };

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let startStreakDate = today;
    if (!dateHasWorkout(today)) {
      if (dateHasWorkout(yesterday)) {
        startStreakDate = yesterday;
      } else {
        startStreakDate = null;
      }
    }

    if (startStreakDate !== null) {
      const d = new Date(startStreakDate);
      while (true) {
        if (dateHasWorkout(d)) {
          currentStreak++;
          d.setDate(d.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return res.status(200).json({
      today: {
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        caloriesBurned,
        waterLiters,
        sleepHours
      },
      weekly,
      streak: {
        current: currentStreak
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard aggregation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
