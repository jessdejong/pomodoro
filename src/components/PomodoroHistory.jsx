import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchPomodoroSessions, deletePomodoroSession } from '../services/pomodoroService';
import './PomodoroHistory.css';

function formatDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function PomodoroHistory({ refreshKey = 0, onTodayCountChange }) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPomodoroSessions(user.uid, { limitCount: 20 });
        setSessions(data);
        if (onTodayCountChange) {
          onTodayCountChange(data.length);
        }
      } catch (err) {
        console.error('Error loading pomodoro history:', err);
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, refreshKey]);

  if (!user) {
    return (
      <div className="history-container">
        <div className="history-header">
          <h3>History</h3>
        </div>
        <p className="history-muted">
          Sign in to save and view your pomodoros.
        </p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!user || !id) return;
    const confirmed = window.confirm('Delete this pomodoro entry? This cannot be undone.');
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deletePomodoroSession(user.uid, id);
      // Optimistically update local list and today count
      setSessions((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (onTodayCountChange) {
          onTodayCountChange(next.length);
        }
        return next;
      });
    } catch (err) {
      console.error('Error deleting pomodoro session:', err);
      window.alert('Failed to delete pomodoro. Please try again later.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>Today's Pomodoros</h3>
        {loading && <span className="history-status">Loading…</span>}
        {error && <span className="history-status error">{error}</span>}
      </div>

      {sessions.length === 0 && !loading ? (
        <p className="history-muted">
          No pomodoros logged yet. Complete a session and save it to see it here.
        </p>
      ) : (
        <ul className="history-list">
          {sessions.map((s) => (
            <li key={s.id} className="history-item">
              <div className="history-main">
                <div>
                  <span className="history-category">{s.category || 'Work'}</span>
                  <span className="history-time">
                    {formatDateTime(s.endedAt || s.createdAt)}
                  </span>
                </div>
                <button
                  type="button"
                  className="history-delete"
                  onClick={() => handleDelete(s.id)}
                  disabled={deletingId === s.id}
                  title="Delete pomodoro"
                >
                  🗑
                </button>
              </div>
              <div className="history-meta">
                <span className="history-duration">
                  {Math.round((s.durationSeconds || 0) / 60)} min
                </span>
                {s.description && (
                  <span className="history-description">{s.description}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PomodoroHistory;


