import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CalorieRing from '../components/CalorieRing';
import WeeklyChart from '../components/WeeklyChart';
import MacroBreakdown from '../components/MacroBreakdown';
import StreakBadge from '../components/StreakBadge';

// Import CSS variables and layout styles
import '../App.css';

function SkeletonCard({ height }) {
  return (
    <div 
      className="skeleton" 
      style={{ 
        height, 
        width: '100%'
      }} 
    />
  );
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Time-based greeting helper
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Date formatter helper
  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading State UI
  if (loading) {
    return (
      <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease' }}>
        {/* Banner Skeleton */}
        <SkeletonCard height="80px" />

        {/* Row 2: 4 Stat Cards Skeleton */}
        <div className="dashboard-row-2">
          <SkeletonCard height="100px" />
          <SkeletonCard height="100px" />
          <SkeletonCard height="100px" />
          <SkeletonCard height="100px" />
        </div>

        {/* Row 3: Charts Skeleton */}
        <div className="dashboard-row-3">
          <SkeletonCard height="300px" />
          <SkeletonCard height="300px" />
        </div>

        {/* Row 4: Bottom Components Skeleton */}
        <div className="dashboard-row-4">
          <SkeletonCard height="200px" />
          <SkeletonCard height="200px" />
        </div>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '4rem 2rem',
          textAlign: 'center'
        }}
      >
        <div 
          className="card" 
          style={{ 
            maxWidth: '450px', 
            border: '1px solid var(--accent-red, #ef4444)',
            boxShadow: '0 10px 20px rgba(239, 68, 68, 0.1)',
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '2.5rem', userSelect: 'none' }}>⚠️</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Error Loading Data
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {error}. Please check your connection or try again.
          </p>
          <button 
            onClick={fetchDashboardData}
            className="btn-primary"
            style={{ 
              backgroundColor: 'var(--accent-red, #ef4444)',
              color: '#ffffff',
              padding: '0.6rem 1.5rem',
              marginTop: '0.5rem',
              border: 'none'
            }}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Destructure metrics with safety fallbacks
  const today = dashboardData?.today || {
    totalCalories: 0,
    caloriesBurned: 0,
    waterLiters: 0,
    sleepHours: null,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  };

  const weekly = dashboardData?.weekly || {
    labels: [],
    calories: [],
    workoutMinutes: []
  };

  const streak = dashboardData?.streak || {
    current: 0,
    longest: 0
  };

  // Safely extract user profile
  const currentUser = dashboardData?.user || user || {
    name: 'User',
    goal: 'maintain',
    dailyCalorieTarget: 2000
  };

  // Safe fallback for streak calculations
  const streakCurrent = streak.current ?? 0;
  const streakLongest = streak.longest ?? (dashboardData?.streak?.longest ?? streakCurrent);

  return (
    <div className="dashboard-container">
      {/* Row 1: Greeting banner */}
      <div className="dashboard-row-1">
        <div 
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid var(--border)',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff' }}>
            {getGreeting()}, {currentUser.name}! 👋
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
            {getFormattedDate()}
          </p>
        </div>
      </div>

      {/* Row 2: 4 stat cards */}
      <div className="dashboard-row-2">
        {/* Calories card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '2.25rem', userSelect: 'none' }}>🍽️</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-green, #22c55e)' }}>
              {today.totalCalories} kcal
            </span>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Consumed
            </span>
          </div>
        </div>

        {/* Burned card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '2.25rem', userSelect: 'none' }}>🔥</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-blue, #3b82f6)' }}>
              {today.caloriesBurned} kcal
            </span>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Burned
            </span>
          </div>
        </div>

        {/* Water card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '2.25rem', userSelect: 'none' }}>💧</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-amber, #f59e0b)' }}>
              {typeof today.waterLiters === 'number' ? today.waterLiters.toFixed(1) : today.waterLiters}L
            </span>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Water Intake
            </span>
          </div>
        </div>

        {/* Sleep card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '2.25rem', userSelect: 'none' }}>😴</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-orange, #f97316)' }}>
              {today.sleepHours !== null && today.sleepHours !== undefined ? `${today.sleepHours}h` : '—'}
            </span>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Sleep Duration
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: CalorieRing (left, 40%) + WeeklyChart (right, 60%) */}
      <div className="dashboard-row-3">
        <div 
          className="card" 
          style={{ 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            alignItems: 'center' 
          }}
        >
          <h4 style={{ fontSize: '1rem', fontWeight: '700', alignSelf: 'flex-start' }}>Calorie Summary</h4>
          <CalorieRing consumed={today.totalCalories} target={currentUser.dailyCalorieTarget} />
        </div>
        
        <div 
          className="card" 
          style={{ 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem' 
          }}
        >
          <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Weekly Activity Trends</h4>
          <WeeklyChart 
            labels={weekly.labels} 
            caloriesData={weekly.calories} 
            workoutMinutesData={weekly.workoutMinutes} 
          />
        </div>
      </div>

      {/* Row 4: MacroBreakdown (left, 50%) + StreakBadge (right, 50%) */}
      <div className="dashboard-row-4">
        <MacroBreakdown protein={today.totalProtein} carbs={today.totalCarbs} fat={today.totalFat} />
        <StreakBadge current={streakCurrent} longest={streakLongest} />
      </div>
    </div>
  );
}
