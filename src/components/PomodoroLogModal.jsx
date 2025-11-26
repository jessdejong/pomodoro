import React, { useState, useEffect } from 'react';
import { useCategories } from '../hooks/useCategories';
import './PomodoroLogModal.css';

function PomodoroLogModal({ isOpen, onClose, onSave, isLoggedIn, defaultCategory = 'Work' }) {
  const { categories, addCategory } = useCategories();
  const [category, setCategory] = useState(defaultCategory);
  const [newCategory, setNewCategory] = useState('');
  const [description, setDescription] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [errors, setErrors] = useState({ category: '', description: '' });

  useEffect(() => {
    if (isOpen) {
      setCategory(defaultCategory);
      setNewCategory('');
      setDescription('');
      setAddingNew(false);
      setErrors({ category: '', description: '' });
    }
  }, [isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleConfirmAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    addCategory(trimmed);
    setCategory(trimmed);
    setNewCategory('');
    setAddingNew(false);
    setErrors((prev) => ({ ...prev, category: '' }));
  };

  const handleCategoryChange = (value) => {
    if (value === '__add_new__') {
      setAddingNew(true);
      setNewCategory('');
      return;
    }
    setAddingNew(false);
    setCategory(value);
    setErrors((prev) => ({ ...prev, category: '' }));
  };

  const handleCancelAddCategory = () => {
    setAddingNew(false);
    setNewCategory('');
    // fall back to current or first existing category
    if (!category && categories.length > 0) {
      setCategory(categories[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onClose();
      return;
    }
    // Guard: user is in the middle of adding a new category but hasn't confirmed it
    if (addingNew) {
      setErrors((prev) => ({
        ...prev,
        category: 'Click “Add” to confirm your new category before saving.',
      }));
      return;
    }
    const nextErrors = { category: '', description: '' };

    const finalCategory = category || defaultCategory || 'Work';
    const finalDescription = description.trim();

    if (!finalCategory) {
      nextErrors.category = 'Category is required';
    }
    if (!finalDescription) {
      nextErrors.description = 'Description is required';
    }

    if (nextErrors.category || nextErrors.description) {
      setErrors(nextErrors);
      return;
    }

    setErrors({ category: '', description: '' });

    onSave({
      category: finalCategory,
      description: finalDescription,
    });
  };

  return (
    <div className="log-modal-overlay" onClick={onClose}>
      <div className="log-modal" onClick={(e) => e.stopPropagation()}>
        <div className="log-modal-header">
          <h2>Log Pomodoro</h2>
          <button className="log-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <p className="log-modal-subtitle">
          Capture what you just focused on so you can review it later.
        </p>

        {!isLoggedIn && (
          <div className="log-modal-warning">
            <p>
              Sign in with Google to save your pomodoros and view history.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="log-modal-form">
          <div className="log-modal-group">
            <label htmlFor="category">Category</label>
            {!addingNew ? (
              <select
                id="category"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={!isLoggedIn}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__add_new__">➕ Add new category…</option>
              </select>
            ) : (
              <div className="log-modal-inline">
                <div className="log-modal-inline-main">
                  <input
                    type="text"
                    id="newCategory"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Type a new category name"
                    disabled={!isLoggedIn}
                  />
                </div>
                <div className="log-modal-inline-actions">
                  <button
                    type="button"
                    className="btn-add-category"
                    onClick={handleConfirmAddCategory}
                    disabled={!isLoggedIn || !newCategory.trim()}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn-link"
                    onClick={handleCancelAddCategory}
                  >
                    Back to categories
                  </button>
                </div>
              </div>
            )}
            {errors.category && (
              <div className="log-modal-error">{errors.category}</div>
            )}
          </div>

          <div className="log-modal-group">
            <label htmlFor="description">What did you do?</label>
            <textarea
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes about this pomodoro..."
              disabled={!isLoggedIn}
            />
            {errors.description && (
              <div className="log-modal-error">{errors.description}</div>
            )}
          </div>

          <div className="log-modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Skip
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                !isLoggedIn ||
                addingNew ||
                !category ||
                !description.trim()
              }
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PomodoroLogModal;


