import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CalorieRing from '../components/CalorieRing';
import WeeklyChart from '../components/WeeklyChart';
import MacroBreakdown from '../components/MacroBreakdown';
import StreakBadge from '../components/StreakBadge';

// Import local layout styles
import '../App.css';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  
  // Temporary check to prevent unused variable warnings before final wiring
  if (dashboardData) {
    console.debug('Dashboard data loaded:', dashboardData);
  }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const userName = user?.name || 'User';

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

  // Loading State
  if (loading) {
    return (
      <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease' }}>
        {/* Banner Skeleton */}
        <div className="skeleton-box" style={{ height: '70px', width: '100%', marginBottom: '0.5rem' }} />

        {/* Row 2: 4 Stat Cards Skeleton */}
        <div className="dashboard-row-2">
          <div className="skeleton-box skeleton-stat-card" />
          <div className="skeleton-box skeleton-stat-card" />
          <div className="skeleton-box skeleton-stat-card" />
          <div className="skeleton-box skeleton-stat-card" />
        </div>

        {/* Row 3: Charts Skeleton */}
        <div className="dashboard-row-3">
          <div className="skeleton-box skeleton-chart-left" />
          <div className="skeleton-box skeleton-chart-right" />
        </div>

        {/* Row 4: Bottom Components Skeleton */}
        <div className="dashboard-row-4">
          <div className="skeleton-box skeleton-bottom-card" />
          <div className="skeleton-box skeleton-bottom-card" />
        </div>
      </div>
    );
  }

  // Error State
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

  // Success State (Layout with placeholder data)
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
            Hello, {userName}! 👋
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
            Track your health logs, stay active, and crush your goals.
          </p>
        </div>
      </div>

      {/* Row 2: 4 stat cards side by side (1fr each) */}
      <div className="dashboard-row-2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Calories Consumed
          </span>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-green, #22c55e)' }}>
            0 kcal
          </span>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Calories Burned
          </span>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-blue, #3b82f6)' }}>
            0 kcal
          </span>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Water Intake
          </span>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-amber, #f59e0b)' }}>
            0.0 L
          </span>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Sleep Duration
          </span>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-orange, #f97316)' }}>
            0.0 hrs
          </span>
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
          <CalorieRing consumed={0} target={2000} />
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
          <WeeklyChart labels={[]} caloriesData={[]} workoutMinutesData={[]} />
        </div>
      </div>

      {/* Row 4: MacroBreakdown (left, 50%) + StreakBadge (right, 50%) */}
      <div className="dashboard-row-4">
        <MacroBreakdown protein={0} carbs={0} fat={0} />
        <StreakBadge current={0} longest={0} />
      </div>
    </div>
  );
}
