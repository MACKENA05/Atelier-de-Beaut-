import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ title, message, onConfirm, onCancel, open }) => {
  if (!open) return null;

  return (
    <div className="confirm-dialog-backdrop">
      <div className="confirm-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-dialog-buttons">
          <button className="confirm-btn" onClick={onConfirm}>Yes</button>
          <button className="cancel-btn" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
