import React from 'react';

export default function StreakBadge({ current, longest }) {
  // Handle edge cases
  const currentStreak = current ?? 0;
  const longestStreak = longest ?? 0;

  return (
    <div 
      className="card" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        border: '1px solid var(--accent-orange)',
        boxShadow: '0 0 12px rgba(249, 115, 22, 0.3)',
        padding: '1.5rem',
        maxWidth: '300px',
        margin: '0 auto',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 0 12px rgba(249, 115, 22, 0.3)';
      }}
    >
      <div 
        style={{ 
          fontSize: '3rem', 
          marginBottom: '0.5rem', 
          filter: 'drop-shadow(0 2px 8px rgba(249, 115, 22, 0.4))',
          userSelect: 'none'
        }}
      >
        🔥
      </div>
      
      {currentStreak === 0 ? (
        <h3 
          style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            lineHeight: '1.4'
          }}
        >
          Start your streak today! 🔥
        </h3>
      ) : (
        <h3 
          style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem'
          }}
        >
          <span 
            style={{ 
              fontSize: '2.5rem', 
              color: 'var(--accent-orange)',
              fontWeight: '800',
              lineHeight: 1
            }}
          >
            {currentStreak}
          </span>
          <span>Day Streak</span>
        </h3>
      )}

      <div 
        style={{ 
          fontSize: '0.875rem', 
          color: 'var(--text-secondary)',
          fontWeight: '500',
          marginTop: '0.25rem'
        }}
      >
        Best: {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
      </div>
    </div>
  );
}
