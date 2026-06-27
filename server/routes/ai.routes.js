const express = require('express');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Meal = require('../models/Meal');
const authMiddleware = require('../middleware/auth.middleware');
const { generateWeeklyPlan, chatWithNutritionist, modifyWeeklyPlan } = require('../services/gemini.service');

const router = express.Router();

// POST /weekly-plan - Generate an AI weekly fitness and diet plan
router.post('/weekly-plan', authMiddleware, async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfWeekly = new Date(startOfToday);
    startOfWeekly.setDate(startOfToday.getDate() - 6);

    // Fetch user and past 7 days of logs in parallel
    const [user, last7DaysWorkouts, last7DaysMeals] = await Promise.all([
      User.findById(req.userId),
      Workout.find({ userId: req.userId, date: { $gte: startOfWeekly, $lte: endOfToday } }).sort({ date: -1 }),
      Meal.find({ userId: req.userId, date: { $gte: startOfWeekly, $lte: endOfToday } }).sort({ date: -1 })
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      name: user.name,
      goal: user.goal,
      dailyCalorieTarget: user.dailyCalorieTarget,
      last7DaysWorkouts,
      last7DaysMeals: last7DaysMeals.slice(0, 15)
    };

    const result = await generateWeeklyPlan(userData);
    return res.status(200).json({ plan: result.weeklyPlan });
  } catch (error) {
    console.error('Error generating weekly plan in route:', error);
    return res.status(500).json({ message: 'Failed to generate plan', error: error.message });
  }
});

// POST /chat - Chat with AI Nutritionist
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { messages, userContext } = req.body;

    // Validate inputs
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'messages must be a non-empty array' });
    }

    const responseText = await chatWithNutritionist(messages, userContext || {});
    return res.status(200).json({ reply: responseText });
  } catch (error) {
    console.error('Error in nutritionist chat route:', error);
    return res.status(500).json({ message: 'AI chat failed', error: error.message });
  }
});

// POST /modify-plan - Modify the generated weekly fitness and diet plan
router.post('/modify-plan', authMiddleware, async (req, res) => {
  try {
    const { currentPlan, modificationInstruction } = req.body;

    if (!currentPlan || !Array.isArray(currentPlan) || currentPlan.length === 0) {
      return res.status(400).json({ message: 'currentPlan must be a non-empty array' });
    }

    if (!modificationInstruction || typeof modificationInstruction !== 'string') {
      return res.status(400).json({ message: 'modificationInstruction must be a non-empty string' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      name: user.name,
      goal: user.goal,
      dailyCalorieTarget: user.dailyCalorieTarget
    };

    const result = await modifyWeeklyPlan(currentPlan, modificationInstruction, userData);
    return res.status(200).json({ plan: result.weeklyPlan });
  } catch (error) {
    console.error('Error modifying weekly plan in route:', error);
    return res.status(500).json({ message: 'Failed to modify plan', error: error.message });
  }
});

module.exports = router;
