import { useState } from 'react';
import api from '../api/axios';
import { Toast, useToast } from '../components/Toast';

export default function Log() {
  const [activeTab, setActiveTab] = useState('workout');
  const { toastProps, showToast } = useToast();

  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Workout state
  const [workoutForm, setWorkoutForm] = useState({
    type: '',
    duration: '',
    caloriesBurned: '',
    notes: '',
    date: getTodayDateString()
  });

  const [workoutErrors, setWorkoutErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleWorkoutSubmit = async () => {
    // Validate
    const errors = {};
    if (!workoutForm.type.trim()) {
      errors.type = 'Workout type is required';
    }
    if (!workoutForm.duration || Number(workoutForm.duration) <= 0) {
      errors.duration = 'Duration must be a positive number';
    }
    
    if (Object.keys(errors).length > 0) {
      setWorkoutErrors(errors);
      showToast('Please fix the validation errors.', 'error');
      return;
    }

    setWorkoutErrors({});
    
    try {
      setLoading(true);
      
      const payload = {
        type: workoutForm.type.trim(),
        duration: Number(workoutForm.duration),
        date: workoutForm.date,
        notes: workoutForm.notes.trim()
      };
      
      if (workoutForm.caloriesBurned) {
        payload.caloriesBurned = Number(workoutForm.caloriesBurned);
      }

      await api.post('/workouts', payload);
      
      showToast('✅ Workout logged!', 'success');
      
      // Reset form
      setWorkoutForm({
        type: '',
        duration: '',
        caloriesBurned: '',
        notes: '',
        date: getTodayDateString()
      });
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to log workout', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputFocusStyle = (e) => {
    e.target.style.borderColor = 'var(--accent-green, #22c55e)';
    e.target.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.15)';
  };

  const inputBlurStyle = (e) => {
    e.target.style.borderColor = 'var(--border, #334155)';
    e.target.style.boxShadow = 'none';
  };

  const inputBaseStyle = {
    width: '100%',
    backgroundColor: 'var(--bg-primary, #0f172a)',
    border: '1px solid var(--border, #334155)',
    color: 'var(--text-primary, #f1f5f9)',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  };

  const labelBaseStyle = {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary, #94a3b8)',
    letterSpacing: '0.025em'
  };

  const tabs = [
    { id: 'workout', label: '💪 Workout' },
    { id: 'meal', label: '🍽️ Meal' },
    { id: 'sleep', label: '😴 Sleep' },
    { id: 'water', label: '💧 Water' }
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Title Header */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff' }}>
          Log Your Activity
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Track metrics and train your FitAI assistant.
        </p>
      </div>

      {/* Tab Navigation */}
      <div 
        style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border, #334155)', 
          gap: '1rem',
          userSelect: 'none',
          overflowX: 'auto'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem 0.5rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                color: isActive ? 'var(--accent-green, #22c55e)' : 'var(--text-secondary, #94a3b8)',
                borderBottom: isActive ? '2px solid var(--accent-green, #22c55e)' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'color 0.2s ease, border-color 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <div className="card" style={{ padding: '2rem 1.75rem' }}>
        
        {/* Workout Tab Form */}
        {activeTab === 'workout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Workout Type Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Workout Type</label>
              <input
                type="text"
                value={workoutForm.type}
                onChange={(e) => setWorkoutForm({ ...workoutForm, type: e.target.value })}
                placeholder="e.g. Running, Gym, Cycling"
                style={{
                  ...inputBaseStyle,
                  borderColor: workoutErrors.type ? 'var(--accent-red, #ef4444)' : 'var(--border, #334155)'
                }}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              />
              {workoutErrors.type && (
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-red, #ef4444)', fontWeight: '600' }}>
                  {workoutErrors.type}
                </span>
              )}
            </div>

            {/* Duration Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Duration</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={workoutForm.duration}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, duration: e.target.value })}
                  placeholder="30"
                  min="1"
                  style={{
                    ...inputBaseStyle,
                    paddingRight: '5rem',
                    borderColor: workoutErrors.duration ? 'var(--accent-red, #ef4444)' : 'var(--border, #334155)'
                  }}
                  onFocus={inputFocusStyle}
                  onBlur={inputBlurStyle}
                />
                <span 
                  style={{ 
                    position: 'absolute', 
                    right: '0.85rem', 
                    color: 'var(--text-secondary, #94a3b8)', 
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    pointerEvents: 'none'
                  }}
                >
                  minutes
                </span>
              </div>
              {workoutErrors.duration && (
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-red, #ef4444)', fontWeight: '600' }}>
                  {workoutErrors.duration}
                </span>
              )}
            </div>

            {/* Calories Burned Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Calories Burned (Optional)</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={workoutForm.caloriesBurned}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, caloriesBurned: e.target.value })}
                  placeholder="250"
                  min="0"
                  style={{
                    ...inputBaseStyle,
                    paddingRight: '3.5rem'
                  }}
                  onFocus={inputFocusStyle}
                  onBlur={inputBlurStyle}
                />
                <span 
                  style={{ 
                    position: 'absolute', 
                    right: '0.85rem', 
                    color: 'var(--text-secondary, #94a3b8)', 
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    pointerEvents: 'none'
                  }}
                >
                  kcal
                </span>
              </div>
            </div>

            {/* Notes Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Notes (Optional)</label>
              <textarea
                value={workoutForm.notes}
                onChange={(e) => setWorkoutForm({ ...workoutForm, notes: e.target.value })}
                placeholder="How did it go? Felt energized, hit a PR, etc."
                rows={3}
                style={{
                  ...inputBaseStyle,
                  resize: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              />
            </div>

            {/* Date Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Date</label>
              <input
                type="date"
                value={workoutForm.date}
                onChange={(e) => setWorkoutForm({ ...workoutForm, date: e.target.value })}
                style={inputBaseStyle}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleWorkoutSubmit}
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '8px',
                marginTop: '0.5rem',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none'
              }}
            >
              {loading ? 'Logging Workout...' : 'Log Workout'}
            </button>

          </div>
        )}

        {/* Placeholders for coming-soon tabs */}
        {activeTab !== 'workout' && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem', userSelect: 'none' }}>🚧</span>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Form Coming Soon
            </h4>
            <p style={{ fontSize: '0.875rem' }}>
              The {activeTab} logging functionality will be added in subsequent steps.
            </p>
          </div>
        )}

      </div>

      {/* Toast popup */}
      <Toast {...toastProps} />
      
    </div>
  );
}
