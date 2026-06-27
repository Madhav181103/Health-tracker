import { useState } from 'react';
import api from '../api/axios';

// Import CSS
import '../App.css';

export default function Plan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/ai/weekly-plan');
      setPlan(response.data.plan);
    } catch (err) {
      console.error('Error generating weekly plan:', err);
      setError('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Loading State UI
  if (loading) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh',
          textAlign: 'center',
          gap: '1.5rem',
          fontFamily: "'Inter', system-ui, sans-serif"
        }}
      >
        <div className="spinner" />
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
          🤖 Gemini is analyzing your data
          <span className="pulse-dot">.</span>
          <span className="pulse-dot">.</span>
          <span className="pulse-dot">.</span>
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Building a custom diet and workout plan based on your recent activity.
        </p>
      </div>
    );
  }

  // 2. Error State UI
  if (error) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh',
          padding: '2rem',
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
            Generation Failed
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {error}
          </p>
          <button 
            onClick={handleGenerate}
            className="btn-primary"
            style={{ 
              backgroundColor: 'var(--accent-red, #ef4444)',
              color: '#ffffff',
              padding: '0.6rem 1.5rem',
              marginTop: '0.5rem',
              border: 'none'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // 3. Plan Display UI (plan !== null)
  if (plan) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Header with Regenerate Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff' }}>
              Your Personalized Weekly Plan
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Designed by Gemini AI to match your goals.
            </p>
          </div>
          <button 
            onClick={handleGenerate}
            className="btn-secondary"
            style={{ 
              padding: '0.6rem 1.2rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>🔄</span> Regenerate Plan
          </button>
        </div>

        {/* Plan Cards Grid */}
        <div className="plan-grid">
          {plan.map((dayPlan, index) => {
            const hasWorkout = dayPlan.workout && dayPlan.workout.type && dayPlan.workout.type.toLowerCase() !== 'rest';
            
            return (
              <div 
                key={dayPlan.day || index} 
                className="card"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem',
                  padding: '1.5rem',
                  height: '100%',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow)'
                }}
              >
                {/* Day Name */}
                <h3 
                  style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '800', 
                    color: 'var(--accent-green, #22c55e)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.5rem',
                    marginBottom: '0.25rem'
                  }}
                >
                  {dayPlan.day}
                </h3>

                {/* Workout Block (Blue tint) */}
                <div 
                  style={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.08)', 
                    border: '1px solid rgba(59, 130, 246, 0.15)',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.9rem', color: '#60a5fa' }}>
                    <span>💪</span> Workout
                  </div>
                  {hasWorkout ? (
                    <>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {dayPlan.workout.type} ({dayPlan.workout.duration} min)
                      </span>
                      {dayPlan.workout.exercises && dayPlan.workout.exercises.length > 0 && (
                        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          {dayPlan.workout.exercises.map((ex, exIdx) => (
                            <li key={exIdx}>{ex}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      Rest Day - Allow your body to recover.
                    </span>
                  )}
                </div>

                {/* Meals Block (Green tint) */}
                <div 
                  style={{ 
                    backgroundColor: 'rgba(34, 197, 94, 0.06)', 
                    border: '1px solid rgba(34, 197, 94, 0.12)',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    flex: 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--accent-green)' }}>
                    <span>🍽️</span> Meals
                  </div>
                  
                  {dayPlan.meals && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                      {Object.entries(dayPlan.meals).map(([mealType, mealInfo]) => {
                        if (!mealInfo || !mealInfo.name) return null;
                        return (
                          <div key={mealType} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '0.2rem' }}>
                            <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)', fontWeight: '500' }}>
                              {mealType}
                            </span>
                            <span style={{ color: 'var(--text-primary)', textAlign: 'right', paddingLeft: '0.5rem', maxWidth: '70%' }}>
                              {mealInfo.name} <span style={{ color: '#22c55e', fontWeight: '600' }}>({mealInfo.calories} kcal)</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div 
                    style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '700', 
                      color: 'var(--text-primary)', 
                      textAlign: 'right',
                      marginTop: '0.25rem',
                      paddingTop: '0.4rem',
                      borderTop: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    Total: {dayPlan.totalCalories} kcal
                  </div>
                </div>

                {/* Daily Tip (Amber tint) */}
                {dayPlan.tip && (
                  <div 
                    style={{ 
                      backgroundColor: 'rgba(245, 158, 11, 0.06)', 
                      border: '1px solid rgba(245, 158, 11, 0.12)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      lineHeight: '1.4'
                    }}
                  >
                    <span style={{ fontSize: '1rem', userSelect: 'none' }}>💡</span>
                    <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      {dayPlan.tip}
                    </span>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 4. Initial/Default State UI (plan === null, not loading)
  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        fontFamily: "'Inter', system-ui, sans-serif"
      }}
    >
      <div 
        className="card"
        style={{
          maxWidth: '500px',
          textAlign: 'center',
          padding: '3rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
        }}
      >
        <span 
          style={{ 
            fontSize: '3.5rem', 
            background: 'rgba(34, 197, 94, 0.1)', 
            padding: '1rem',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            marginBottom: '0.5rem'
          }}
        >
          🤖
        </span>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff' }}>
          Your Personalized Weekly Plan
        </h2>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Gemini AI will analyze your last 7 days of activity and create a custom fitness and nutrition plan tailored specifically to your goals.
        </p>
        <button
          onClick={handleGenerate}
          className="btn-primary"
          style={{
            padding: '0.75rem 2rem',
            fontSize: '0.95rem',
            fontWeight: '700',
            borderRadius: '8px',
            marginTop: '0.75rem',
            border: 'none'
          }}
        >
          Generate My Plan
        </button>
      </div>
    </div>
  );
}
