import { useEffect, useState } from 'react';

export function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    if (!message) return;
    
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const bgColors = {
    success: '#166534',
    error: '#7f1d1d',
    info: '#1e3a5f'
  };

  const borderColors = {
    success: '#22c55e',
    error: '#ef4444',
    info: '#3b82f6'
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        padding: '1rem 1.5rem',
        borderRadius: 'var(--radius, 12px)',
        width: '320px',
        backgroundColor: bgColors[type] || bgColors.info,
        border: `1px solid ${borderColors[type] || borderColors.info}`,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        animation: 'toastFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        backdropFilter: 'blur(8px)',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      <style>{`
        @keyframes toastFadeIn {
          from {
            transform: translateY(1rem) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <span style={{ fontSize: '0.925rem', fontWeight: '500', flex: 1, marginRight: '1rem' }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          padding: '0 0.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s ease',
          lineHeight: 1
        }}
        onMouseEnter={(e) => e.target.style.color = '#ffffff'}
        onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState({
    message: '',
    type: 'info',
    visible: false
  });

  const showToast = (message, type = 'info') => {
    setToast({
      message,
      type,
      visible: true
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      visible: false
    }));
  };

  return {
    toastProps: {
      message: toast.visible ? toast.message : '',
      type: toast.type,
      onClose: hideToast
    },
    showToast
  };
}
