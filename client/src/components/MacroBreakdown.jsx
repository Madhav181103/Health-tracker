import React from 'react';

export default function MacroBreakdown({ protein, carbs, fat }) {
  const p = protein ?? 0;
  const c = carbs ?? 0;
  const f = fat ?? 0;

  const total = p + c + f;
  const isZero = total === 0;

  // Calculate percentages, ensuring they sum up nicely or handle division by zero
  const proteinPct = isZero ? 0 : Math.round((p / total) * 100);
  const carbsPct = isZero ? 0 : Math.round((c / total) * 100);
  const fatPct = isZero ? 0 : Math.round((f / total) * 100);

  if (isZero) {
    return (
      <div 
        className="card" 
        style={{ 
          textAlign: 'center', 
          color: 'var(--text-secondary)', 
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span style={{ fontSize: '2rem', marginBottom: '0.5rem', userSelect: 'none' }}>🍽️</span>
        <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>No meals logged today</p>
      </div>
    );
  }

  const macros = [
    { 
      label: 'Protein', 
      amount: p, 
      pct: proteinPct, 
      color: 'var(--accent-blue, #3b82f6)' 
    },
    { 
      label: 'Carbs', 
      amount: c, 
      pct: carbsPct, 
      color: 'var(--accent-orange, #f97316)' 
    },
    { 
      label: 'Fat', 
      amount: f, 
      pct: fatPct, 
      color: 'var(--accent-amber, #f59e0b)' 
    }
  ];

  return (
    <div 
      className="card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.25rem',
        width: '100%'
      }}
    >
      <h3 
        style={{ 
          fontSize: '1.1rem', 
          fontWeight: '700', 
          color: 'var(--text-primary)', 
          marginBottom: '0.25rem' 
        }}
      >
        Macro Breakdown
      </h3>
      
      {macros.map((macro) => (
        <div key={macro.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'baseline', 
              fontSize: '0.875rem' 
            }}
          >
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              {macro.label}
              <span 
                style={{ 
                  fontWeight: 'normal', 
                  color: 'var(--text-secondary)', 
                  marginLeft: '0.5rem' 
                }}
              >
                {macro.amount}g
              </span>
            </span>
            <span style={{ fontWeight: '700', color: macro.color }}>
              {macro.pct}%
            </span>
          </div>
          
          {/* Bar container */}
          <div 
            style={{ 
              background: 'var(--bg-primary, #0f172a)', 
              borderRadius: '4px', 
              height: '8px', 
              width: '100%', 
              overflow: 'hidden' 
            }}
          >
            {/* Bar fill */}
            <div 
              style={{ 
                background: macro.color, 
                height: '100%', 
                width: `${macro.pct}%`, 
                borderRadius: '4px', 
                transition: 'width 0.5s ease' 
              }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}
