const express = require('express');
const Workout = require('../models/Workout');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// POST / - Create a workout
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, duration, caloriesBurned, notes, date } = req.body;

    // Validate required fields
    if (!type || !duration) {
      return res.status(400).json({ message: 'Workout type and duration are required' });
    }

    const newWorkout = new Workout({
      userId: req.userId,
      type,
      duration,
      caloriesBurned,
      notes,
      date: date || undefined
    });

    const savedWorkout = await newWorkout.save();
    return res.status(201).json(savedWorkout);
  } catch (error) {
    console.error('Error creating workout:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET / - Get workouts
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

    const workouts = await Workout.find(query)
      .sort({ date: -1 })
      .limit(limit);

    return res.status(200).json(workouts);
  } catch (error) {
    console.error('Error getting workouts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /:id - Delete a workout
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Find workout by id AND userId (security check)
    const deletedWorkout = await Workout.findOneAndDelete({ _id: id, userId: req.userId });

    if (!deletedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    return res.status(200).json({ message: 'Workout deleted' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
