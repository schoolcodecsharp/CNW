import React from 'react';
import './ConfirmModal.css';

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'warning',
  onConfirm,
  onCancel
}) => {
  if (!show) return null;

  const icons = {
    danger: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const colors = {
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon" style={{ color: colors[type] }}>
          {icons[type]}
        </div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button 
            className="confirm-btn confirm-btn-confirm" 
            style={{ background: colors[type] }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
