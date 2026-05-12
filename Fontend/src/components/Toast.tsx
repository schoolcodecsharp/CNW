import React from 'react';
import './Toast.css';

interface ToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ show, message, type, onClose }) => {
  if (!show) return null;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  return (
    <div className="toast-container">
      <div className="toast-content" style={{ background: colors[type] }}>
        <div className="toast-icon">{icons[type]}</div>
        <div className="toast-message">{message}</div>
        <button className="toast-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default Toast;
