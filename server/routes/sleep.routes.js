const express = require('express');
const Sleep = require('../models/Sleep');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// POST / - Log sleep
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { hours, quality, date } = req.body;

    // Validate hours
    if (hours === undefined || typeof hours !== 'number' || hours < 0 || hours > 24) {
      return res.status(400).json({ message: 'Hours must be a number between 0 and 24' });
    }

    const newSleep = new Sleep({
      userId: req.userId,
      hours,
      quality,
      date: date || undefined
    });

    const savedSleep = await newSleep.save();
    return res.status(201).json(savedSleep);
  } catch (error) {
    console.error('Error logging sleep:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET / - Get sleep logs
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
      limit = 7;
    }

    const sleepLogs = await Sleep.find(query)
      .sort({ date: -1 })
      .limit(limit);

    return res.status(200).json(sleepLogs);
  } catch (error) {
    console.error('Error getting sleep logs:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
