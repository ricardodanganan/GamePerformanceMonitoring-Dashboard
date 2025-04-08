import React from 'react';
import './SimulatedModal.css';

const SimulatedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Close only if clicked outside the modal content
    if (e.target.className === 'sim-modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="sim-modal-overlay" onClick={handleOverlayClick}>
      <div className="sim-modal-content">
        <h3>💡Optimization:</h3>
        <ul>
          <li>This game can run at <strong>Ultra</strong> settings.</li>
          <li><strong>Recommended Settings:</strong></li>
          <ul className="inner-list">
            <li>Resolution: 1920x1080</li>
            <li>Shadows: High</li>
            <li>Anti-Aliasing: TAA</li>
            <li>Texture Quality: Ultra</li>
            <li>V-Sync: On</li>
          </ul>
        </ul>
        <p className="summary">✅ Your system exceeds all game requirements.</p>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SimulatedModal;
