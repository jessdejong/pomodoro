import React, { useState, useEffect } from 'react';
import { playCompletionSound } from '../utils/sound';
import './Settings.css';

function Settings({ settings, onUpdate, onClose, onReset }) {
  const [localSettings, setLocalSettings] = useState({
    workDuration: settings.workDuration,
    shortBreakDuration: settings.shortBreakDuration,
    soundEnabled: settings.soundEnabled !== undefined ? settings.soundEnabled : true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLocalSettings({
      workDuration: settings.workDuration,
      shortBreakDuration: settings.shortBreakDuration,
      soundEnabled: settings.soundEnabled !== undefined ? settings.soundEnabled : true,
    });
  }, [settings]);

  const validate = (name, value) => {
    const numValue = parseInt(value, 10);
    const errors = {};

    if (isNaN(numValue) || numValue < 1) {
      errors[name] = 'Must be at least 1 minute';
      return errors;
    }

    if (name === 'workDuration' && numValue > 120) {
      errors[name] = 'Work duration cannot exceed 120 minutes';
      return errors;
    }

    if (name === 'shortBreakDuration' && numValue > 60) {
      errors[name] = 'Break duration cannot exceed 60 minutes';
      return errors;
    }

    return {};
  };

  const handleChange = (name, value) => {
    // Handle boolean values (for checkboxes)
    if (typeof value === 'boolean') {
      setLocalSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    // Handle number inputs
    const validationErrors = validate(name, value);
    setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));

    setLocalSettings((prev) => ({
      ...prev,
      [name]: value === '' ? '' : parseInt(value, 10) || 0,
    }));
  };

  const handleTestSound = () => {
    playCompletionSound();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate only numeric fields (skip boolean fields like soundEnabled)
    const allErrors = {};
    const numericFields = ['workDuration', 'shortBreakDuration'];
    
    numericFields.forEach((key) => {
      if (localSettings[key] !== undefined) {
        const fieldErrors = validate(key, localSettings[key]);
        Object.assign(allErrors, fieldErrors);
      }
    });

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    // Update settings
    onUpdate(localSettings);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to defaults?')) {
      onReset();
      onClose();
    }
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <button className="settings-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-group">
            <label htmlFor="workDuration">
              Work Duration (minutes)
            </label>
            <input
              type="number"
              id="workDuration"
              min="1"
              max="120"
              value={localSettings.workDuration}
              onChange={(e) => handleChange('workDuration', e.target.value)}
              className={errors.workDuration ? 'error' : ''}
            />
            {errors.workDuration && (
              <span className="error-message">{errors.workDuration}</span>
            )}
          </div>

          <div className="settings-group">
            <label htmlFor="shortBreakDuration">
              Break Duration (minutes)
            </label>
            <input
              type="number"
              id="shortBreakDuration"
              min="1"
              max="60"
              value={localSettings.shortBreakDuration}
              onChange={(e) => handleChange('shortBreakDuration', e.target.value)}
              className={errors.shortBreakDuration ? 'error' : ''}
            />
            {errors.shortBreakDuration && (
              <span className="error-message">{errors.shortBreakDuration}</span>
            )}
          </div>

          <div className="settings-group">
            <div className="settings-toggle">
              <label htmlFor="soundEnabled" className="toggle-label">
                <input
                  type="checkbox"
                  id="soundEnabled"
                  checked={localSettings.soundEnabled}
                  onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                  className="toggle-input"
                />
                <span className="toggle-text">Enable Notification Sound</span>
              </label>
              {localSettings.soundEnabled && (
                <button
                  type="button"
                  className="btn-test-sound"
                  onClick={handleTestSound}
                  title="Test sound"
                >
                  🔊 Test Sound
                </button>
              )}
            </div>
          </div>

          <div className="settings-actions">
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset to Defaults
            </button>
            <div className="settings-actions-right">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;

