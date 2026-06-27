import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CalorieRing({ consumed, target }) {
  const caloriesConsumed = consumed ?? 0;
  const caloriesTarget = target ?? 0;

  const isOverTarget = caloriesConsumed > caloriesTarget;
  const chartTarget = caloriesTarget || 1; // Prevent 0 target chart rendering issues

  const data = {
    labels: isOverTarget ? ['Target', 'Extra'] : ['Consumed', 'Remaining'],
    datasets: [
      {
        data: isOverTarget
          ? [chartTarget, caloriesConsumed - chartTarget]
          : [caloriesConsumed, Math.max(0, chartTarget - caloriesConsumed)],
        backgroundColor: isOverTarget
          ? ['#ef4444', '#7f1d1d']
          : ['#22c55e', '#334155'],
        borderWidth: 0,
        hoverOffset: 2,
      },
    ],
  };

  const options = {
    cutout: '72%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            return ` ${context.label}: ${context.raw} kcal`;
          },
        },
      },
    },
    maintainAspectRatio: true,
  };

  return (
    <div style={{ maxWidth: '220px', margin: 'auto', position: 'relative' }}>
      <Doughnut data={data} options={options} />
      
      {/* Center text overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none', // Allows hover triggers on the chart underneath
          userSelect: 'none',
        }}
      >
        <span
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: 1.1,
          }}
        >
          {caloriesConsumed}
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary, #94a3b8)',
            marginTop: '0.1rem',
          }}
        >
          / {caloriesTarget} kcal
        </span>
        <span
          style={{
            fontSize: '0.6rem',
            fontWeight: '700',
            color: 'var(--text-secondary, #94a3b8)',
            letterSpacing: '0.07em',
            marginTop: '0.2rem',
          }}
        >
          CALORIES
        </span>
      </div>
    </div>
  );
}
