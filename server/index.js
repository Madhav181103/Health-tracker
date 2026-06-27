require('dotenv').config();
const dns = require('dns');
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Health Tracker API is running' });
});

// Routes
const authRouter = require('./routes/auth.routes');
app.use('/api/auth', authRouter);

const workoutRouter = require('./routes/workout.routes');
app.use('/api/workouts', workoutRouter);

const mealRouter = require('./routes/meal.routes');
app.use('/api/meals', mealRouter);

const sleepRouter = require('./routes/sleep.routes');
app.use('/api/sleep', sleepRouter);

const waterRouter = require('./routes/water.routes');
app.use('/api/water', waterRouter);

const dashboardRouter = require('./routes/dashboard.routes');
app.use('/api/dashboard', dashboardRouter);

const aiRouter = require('./routes/ai.routes');
app.use('/api/ai', aiRouter);

// 404 Handler (for unknown routes)
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    // only show stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
