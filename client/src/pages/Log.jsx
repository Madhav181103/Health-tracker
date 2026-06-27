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

  const [loading, setLoading] = useState(false);

  // ==========================================
  // 1. WORKOUT FORM STATE & HANDLERS
  // ==========================================
  const [workoutForm, setWorkoutForm] = useState({
    type: '',
    duration: '',
    caloriesBurned: '',
    notes: '',
    date: getTodayDateString()
  });
  const [workoutErrors, setWorkoutErrors] = useState({});

  const handleWorkoutSubmit = async () => {
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

  // ==========================================
  // 2. MEAL FORM STATE & HANDLERS
  // ==========================================
  const [mealForm, setMealForm] = useState({
    name: '',
    mealType: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    date: getTodayDateString()
  });
  const [mealErrors, setMealErrors] = useState({});

  const handleMealSubmit = async () => {
    const errors = {};
    if (!mealForm.name.trim()) {
      errors.name = 'Food name is required';
    }
    if (!mealForm.calories || Number(mealForm.calories) <= 0) {
      errors.calories = 'Calories must be a positive number';
    }
    if (mealForm.protein && Number(mealForm.protein) < 0) {
      errors.protein = 'Protein cannot be negative';
    }
    if (mealForm.carbs && Number(mealForm.carbs) < 0) {
      errors.carbs = 'Carbs cannot be negative';
    }
    if (mealForm.fat && Number(mealForm.fat) < 0) {
      errors.fat = 'Fat cannot be negative';
    }

    if (Object.keys(errors).length > 0) {
      setMealErrors(errors);
      showToast('Please fix the validation errors.', 'error');
      return;
    }

    setMealErrors({});

    try {
      setLoading(true);
      const payload = {
        name: mealForm.name.trim(),
        mealType: mealForm.mealType,
        calories: Number(mealForm.calories),
        protein: mealForm.protein ? Number(mealForm.protein) : 0,
        carbs: mealForm.carbs ? Number(mealForm.carbs) : 0,
        fat: mealForm.fat ? Number(mealForm.fat) : 0,
        date: mealForm.date
      };

      await api.post('/meals', payload);
      showToast('✅ Meal logged!', 'success');
      setMealForm({
        name: '',
        mealType: 'breakfast',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        date: getTodayDateString()
      });
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to log meal', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 3. SLEEP FORM STATE & HANDLERS
  // ==========================================
  const [sleepForm, setSleepForm] = useState({
    hours: '',
    quality: 3,
    date: getTodayDateString()
  });
  const [sleepErrors, setSleepErrors] = useState({});

  const sleepQualityLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  const handleSleepSubmit = async () => {
    const errors = {};
    const sleepHours = Number(sleepForm.hours);
    if (!sleepForm.hours || sleepHours < 0 || sleepHours > 24) {
      errors.hours = 'Hours slept must be between 0 and 24';
    }

    if (Object.keys(errors).length > 0) {
      setSleepErrors(errors);
      showToast('Please fix the validation errors.', 'error');
      return;
    }

    setSleepErrors({});

    try {
      setLoading(true);
      const payload = {
        hours: sleepHours,
        quality: Number(sleepForm.quality),
        date: sleepForm.date
      };

      await api.post('/sleep', payload);
      showToast('✅ Sleep logged!', 'success');
      setSleepForm({
        hours: '',
        quality: 3,
        date: getTodayDateString()
      });
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to log sleep', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 4. WATER FORM STATE & HANDLERS
  // ==========================================
  const [waterForm, setWaterForm] = useState({
    liters: '',
    date: getTodayDateString()
  });
  const [waterErrors, setWaterErrors] = useState({});

  const handleQuickAddWater = (amount) => {
    const current = parseFloat(waterForm.liters) || 0;
    const nextVal = (current + amount).toFixed(2);
    setWaterForm(prev => ({
      ...prev,
      liters: parseFloat(nextVal).toString()
    }));
  };

  const handleWaterSubmit = async () => {
    const errors = {};
    const amountLiters = Number(waterForm.liters);
    if (!waterForm.liters || amountLiters <= 0) {
      errors.liters = 'Liters must be a positive number';
    }

    if (Object.keys(errors).length > 0) {
      setWaterErrors(errors);
      showToast('Please fix the validation errors.', 'error');
      return;
    }

    setWaterErrors({});

    try {
      setLoading(true);
      const payload = {
        liters: amountLiters,
        date: waterForm.date
      };

      await api.post('/water', payload);
      showToast('✅ Water intake logged!', 'success');
      setWaterForm({
        liters: '',
        date: getTodayDateString()
      });
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to log water', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STYLING HELPERS & DATA DEFINITIONS
  // ==========================================
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
        
        {/* ==========================================
            WORKOUT TAB FORM
            ========================================== */}
        {activeTab === 'workout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Workout Type */}
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

            {/* Duration */}
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

            {/* Calories Burned */}
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

            {/* Notes */}
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

            {/* Date */}
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

        {/* ==========================================
            MEAL TAB FORM
            ========================================== */}
        {activeTab === 'meal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Food Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Food Name</label>
              <input
                type="text"
                value={mealForm.name}
                onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                placeholder="e.g. Chicken Salad, Oatmeal"
                style={{
                  ...inputBaseStyle,
                  borderColor: mealErrors.name ? 'var(--accent-red, #ef4444)' : 'var(--border, #334155)'
                }}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              />
              {mealErrors.name && (
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-red, #ef4444)', fontWeight: '600' }}>
                  {mealErrors.name}
                </span>
              )}
            </div>

            {/* Meal Type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Meal Type</label>
              <select
                value={mealForm.mealType}
                onChange={(e) => setMealForm({ ...mealForm, mealType: e.target.value })}
                style={{
                  ...inputBaseStyle,
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem',
                  backgroundRepeat: 'no-repeat',
                  paddingRight: '2rem'
                }}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              >
                <option value="breakfast" style={{ backgroundColor: '#1e293b' }}>Breakfast</option>
                <option value="lunch" style={{ backgroundColor: '#1e293b' }}>Lunch</option>
                <option value="dinner" style={{ backgroundColor: '#1e293b' }}>Dinner</option>
                <option value="snack" style={{ backgroundColor: '#1e293b' }}>Snack</option>
              </select>
            </div>

            {/* Calories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Calories</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={mealForm.calories}
                  onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })}
                  placeholder="350"
                  min="1"
                  style={{
                    ...inputBaseStyle,
                    paddingRight: '3.5rem',
                    borderColor: mealErrors.calories ? 'var(--accent-red, #ef4444)' : 'var(--border, #334155)'
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
              {mealErrors.calories && (
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-red, #ef4444)', fontWeight: '600' }}>
                  {mealErrors.calories}
                </span>
              )}
            </div>

            {/* Macros Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {/* Protein */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelBaseStyle}>Protein (g)</label>
                <input
                  type="number"
                  value={mealForm.protein}
                  onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })}
                  placeholder="25"
                  min="0"
                  style={{
                    ...inputBaseStyle,
                    borderColor: mealErrors.protein ? 'var(--accent-red, #ef4444)' : 'var(--border, #334155)'
                  }}
                  onFocus={inputFocusStyle}
                  onBlur={inputBlurStyle}
                />
                {mealErrors.protein && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-red, #ef4444)', fontWeight: '600' }}>
                    {mealErrors.protein}
                  </span>
                )}
              </div>

              {/* Carbs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelBaseStyle}>Carbs (g)</label>
                <input
                  type="number"
                  value={mealForm.carbs}
                  onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })}
                  placeholder="40"
                  min="0"
                  style={{
                    ...inputBaseStyle,
                    borderColor: mealErrors.carbs ? 'var(--accent-red, #ef4444)' : 'var(--border, #334155)'
                  }}
                  onFocus={inputFocusStyle}
                  onBlur={inputBlurStyle}
                />
                {mealErrors.carbs && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-red, #ef4444)', fontWeight: '600' }}>
                    {mealErrors.carbs}
                  </span>
                )}
              </div>

              {/* Fat */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelBaseStyle}>Fat (g)</label>
                <input
                  type="number"
                  value={mealForm.fat}
                  onChange={(e) => setMealForm({ ...mealForm, fat: e.target.value })}
                  placeholder="10"
                  min="0"
                  style={{
                    ...inputBaseStyle,
                    borderColor: mealErrors.fat ? 'var(--accent-red, #ef4444)' : 'var(--border, #334155)'
                  }}
                  onFocus={inputFocusStyle}
                  onBlur={inputBlurStyle}
                />
                {mealErrors.fat && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-red, #ef4444)', fontWeight: '600' }}>
                    {mealErrors.fat}
                  </span>
                )}
              </div>
            </div>

            {/* Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Date</label>
              <input
                type="date"
                value={mealForm.date}
                onChange={(e) => setMealForm({ ...mealForm, date: e.target.value })}
                style={inputBaseStyle}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleMealSubmit}
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
              {loading ? 'Logging Meal...' : 'Log Meal'}
            </button>
          </div>
        )}

        {/* ==========================================
            SLEEP TAB FORM
            ========================================== */}
        {activeTab === 'sleep' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Hours Slept */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Hours Slept</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={sleepForm.hours}
                  onChange={(e) => setSleepForm({ ...sleepForm, hours: e.target.value })}
                  placeholder="7.5"
                  step="0.5"
                  min="0"
                  max="24"
                  style={{
                    ...inputBaseStyle,
                    paddingRight: '4.5rem',
                    borderColor: sleepErrors.hours ? 'var(--accent-red, #ef4444)' : 'var(--border, #334155)'
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
                  hours
                </span>
              </div>
              {sleepErrors.hours && (
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-red, #ef4444)', fontWeight: '600' }}>
                  {sleepErrors.hours}
                </span>
              )}
            </div>

            {/* Sleep Quality */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Sleep Quality</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={sleepForm.quality}
                  onChange={(e) => setSleepForm({ ...sleepForm, quality: Number(e.target.value) })}
                  style={{ 
                    flex: 1, 
                    cursor: 'pointer',
                    accentColor: 'var(--accent-green, #22c55e)'
                  }}
                />
                <span 
                  style={{ 
                    fontSize: '0.95rem', 
                    fontWeight: '700', 
                    color: 'var(--accent-green, #22c55e)',
                    minWidth: '95px',
                    textAlign: 'right'
                  }}
                >
                  {sleepForm.quality} - {sleepQualityLabels[sleepForm.quality]}
                </span>
              </div>
            </div>

            {/* Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Date</label>
              <input
                type="date"
                value={sleepForm.date}
                onChange={(e) => setSleepForm({ ...sleepForm, date: e.target.value })}
                style={inputBaseStyle}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSleepSubmit}
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
              {loading ? 'Logging Sleep...' : 'Log Sleep'}
            </button>
          </div>
        )}

        {/* ==========================================
            WATER TAB FORM
            ========================================== */}
        {activeTab === 'water' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Amount (Liters) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Liters Consumed</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={waterForm.liters}
                  onChange={(e) => setWaterForm({ ...waterForm, liters: e.target.value })}
                  placeholder="0.5"
                  step="0.1"
                  min="0.1"
                  style={{
                    ...inputBaseStyle,
                    paddingRight: '3.5rem',
                    borderColor: waterErrors.liters ? 'var(--accent-red, #ef4444)' : 'var(--border, #334155)'
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
                  Liters
                </span>
              </div>
              {waterErrors.liters && (
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-red, #ef4444)', fontWeight: '600' }}>
                  {waterErrors.liters}
                </span>
              )}
            </div>

            {/* Quick Add Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ ...labelBaseStyle, fontSize: '0.75rem' }}>Quick Add</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                <button
                  onClick={() => handleQuickAddWater(0.25)}
                  className="btn-secondary"
                  style={{ padding: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  +0.25 L
                </button>
                <button
                  onClick={() => handleQuickAddWater(0.5)}
                  className="btn-secondary"
                  style={{ padding: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  +0.50 L
                </button>
                <button
                  onClick={() => handleQuickAddWater(1.0)}
                  className="btn-secondary"
                  style={{ padding: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  +1.00 L
                </button>
              </div>
            </div>

            {/* Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelBaseStyle}>Date</label>
              <input
                type="date"
                value={waterForm.date}
                onChange={(e) => setWaterForm({ ...waterForm, date: e.target.value })}
                style={inputBaseStyle}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleWaterSubmit}
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
              {loading ? 'Logging Water...' : 'Log Water'}
            </button>
          </div>
        )}

      </div>

      {/* Toast popup */}
      <Toast {...toastProps} />
      
    </div>
  );
}
