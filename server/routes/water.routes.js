const express = require('express');
const Water = require('../models/Water');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// POST / - Log water intake
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { liters, date } = req.body;

    // Validate liters
    if (liters === undefined || typeof liters !== 'number' || liters <= 0) {
      return res.status(400).json({ message: 'Liters must be a number greater than 0' });
    }

    const newWater = new Water({
      userId: req.userId,
      liters,
      date: date || undefined
    });

    const savedWater = await newWater.save();
    return res.status(201).json(savedWater);
  } catch (error) {
    console.error('Error logging water intake:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET / - Get water logs
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;
    const query = { userId: req.userId };

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
      // Last 7 days of water entries
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      query.date = { $gte: sevenDaysAgo };
    }

    const waterLogs = await Water.find(query)
      .sort({ date: -1 });

    return res.status(200).json(waterLogs);
  } catch (error) {
    console.error('Error getting water logs:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
