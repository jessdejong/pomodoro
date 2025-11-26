import { useState, useEffect } from 'react';

const DEFAULT_CATEGORIES = ['Work', 'Study', 'Admin'];
const STORAGE_KEY = 'pomodoro-categories';

export function useCategories() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, []);

  const addCategory = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setCategories((prev) => {
      if (prev.includes(trimmed)) return prev;
      const updated = [...prev, trimmed];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving categories:', error);
      }
      return updated;
    });
  };

  return {
    categories,
    addCategory,
  };
}


