# ⚡ FitAI — AI Health & Fitness Tracker

> Full-stack health tracking app with personalized AI plans powered by Google Gemini

## Features
- 🏋️ Log workouts, meals, sleep & water
- 🤖 AI-generated personalized weekly plans
- 🥗 Real-time AI nutritionist chatbot
- 📊 Progress charts with Chart.js
- 🔥 Workout streak tracking
- 🔐 JWT authentication

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React, Vite, Chart.js, React Router |
| Backend | Node.js, Express, MongoDB, Mongoose |
| AI | Google Gemini 3.5 Flash |
| Auth | JWT + bcrypt |
| Deploy | Render (API) + Vercel (Client) |

## Local Setup
```bash
# Clone the repo
git clone <your-repo-url>

# Setup server
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev

# Setup client (new terminal)
cd client
cp .env.example .env   # fill in your values
npm install
npm run dev
```

## Deployment
- **Live Site (Frontend)**: [https://client-flame-alpha-29.vercel.app](https://client-flame-alpha-29.vercel.app)
- **API Server (Backend)**: [https://health-tracker-backend-5mk8.onrender.com](https://health-tracker-backend-5mk8.onrender.com)
- **Database**: MongoDB Atlas (Free M0 tier)
