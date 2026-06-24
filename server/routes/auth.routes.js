const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    // 1. Destructure fields from request body
    const { name, email, password, goal, dailyCalorieTarget } = req.body;

    // 2. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // 3. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create and save new User document
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      goal,
      dailyCalorieTarget
    });
    await newUser.save();

    // 6. Generate a JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // 7. Return 201 with token and user details (excluding password hash)
    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        goal: newUser.goal,
        dailyCalorieTarget: newUser.dailyCalorieTarget
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
