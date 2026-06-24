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

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    // 1. Destructure email and password from req.body
    const { email, password } = req.body;

    // 2. Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 3. Find user by email in MongoDB
    const user = await User.findOne({ email });

    // Security Note:
    // We use the same error message ("Invalid credentials") for both "user not found" and "wrong password"
    // to prevent user enumeration. If we gave specific errors (like "user does not exist" or "incorrect password"),
    // an attacker could probe the API to discover valid email addresses registered on the platform.
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 4. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 5. Generate JWT (userId payload, 7d expiry)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // 6. Return 200 with token and user details
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        goal: user.goal,
        dailyCalorieTarget: user.dailyCalorieTarget
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
