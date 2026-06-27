import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function WeeklyChart({ labels = [], caloriesData = [], workoutMinutesData = [] }) {
  // Safe defaults for 7 days
  const dayLabels = labels.length > 0 ? labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const calories = caloriesData.length > 0 ? caloriesData : [0, 0, 0, 0, 0, 0, 0];
  const workouts = workoutMinutesData.length > 0 ? workoutMinutesData : [0, 0, 0, 0, 0, 0, 0];

  const isEmpty = calories.every(val => val === 0) && workouts.every(val => val === 0);

  const data = {
    labels: dayLabels,
    datasets: [
      {
        label: 'Calories',
        data: calories,
        backgroundColor: '#22c55e', // var(--accent-green)
        borderRadius: 6,
      },
      {
        label: 'Workout (min)',
        data: workouts,
        backgroundColor: '#3b82f6', // var(--accent-blue)
        borderRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#f1f5f9', // var(--text-primary)
          font: {
            family: "'Inter', system-ui, -apple-system, sans-serif",
            weight: '600',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#f1f5f9',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#94a3b8' // var(--text-secondary)
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#334155' // var(--border)
        },
        ticks: {
          color: '#94a3b8'
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
      <div 
        style={{ 
          width: '100%', 
          height: '100%', 
          opacity: isEmpty ? 0.15 : 1, 
          transition: 'opacity 0.3s ease',
          backgroundColor: 'transparent'
        }}
      >
        <Bar data={data} options={options} />
      </div>

      {isEmpty && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.4)', // semi-transparent primary bg
            backdropFilter: 'blur(4px)',
            borderRadius: 'var(--radius, 12px)',
            pointerEvents: 'none',
            padding: '1rem',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              padding: '1.25rem 2rem',
              backgroundColor: '#1e293b', // var(--bg-card)
              border: '1px solid #334155', // var(--border)
              borderRadius: 'var(--radius, 12px)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              color: '#94a3b8', // var(--text-secondary)
              fontSize: '0.9rem',
              fontWeight: '500',
              maxWidth: '85%',
              lineHeight: '1.5'
            }}
          >
            No data yet — log workouts and meals to see trends
          </div>
        </div>
      )}
    </div>
  );
}
