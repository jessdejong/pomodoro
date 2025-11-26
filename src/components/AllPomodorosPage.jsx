import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchAllPomodoroSessions, deletePomodoroSession } from '../services/pomodoroService';
import './PomodoroHistory.css';

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDayLabel(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function AllPomodorosPage() {
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
        const data = await fetchAllPomodoroSessions(user.uid, { limitCount: 200 });
        setSessions(data);
      } catch (err) {
        console.error('Error loading all pomodoros:', err);
        setError('Failed to load pomodoros');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const handleDelete = async (id) => {
    if (!user || !id) return;
    const confirmed = window.confirm('Delete this pomodoro entry? This cannot be undone.');
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deletePomodoroSession(user.uid, id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Error deleting pomodoro session:', err);
      window.alert('Failed to delete pomodoro. Please try again later.');
    } finally {
      setDeletingId(null);
    }
  };

  const groupedByDay = useMemo(() => {
    const groups = {};
    sessions.forEach((s) => {
      const ts = s.endedAt || s.createdAt;
      const d = ts ? new Date(ts) : null;
      const key = d && !Number.isNaN(d.getTime())
        ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString()
        : 'Unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    });
    // sort each group by time desc
    Object.values(groups).forEach((list) =>
      list.sort((a, b) => {
        const ta = new Date(a.endedAt || a.createdAt).getTime();
        const tb = new Date(b.endedAt || b.createdAt).getTime();
        return tb - ta;
      }),
    );
    return groups;
  }, [sessions]);

  const sortedDayKeys = useMemo(
    () => Object.keys(groupedByDay).sort((a, b) => new Date(b) - new Date(a)),
    [groupedByDay],
  );

  if (!user) {
    return (
      <div className="history-container all-page">
        <div className="history-header">
          <h2>All Pomodoros</h2>
        </div>
        <p className="history-muted">
          Sign in to see your pomodoros across all days.
        </p>
      </div>
    );
  }

  return (
    <div className="history-container all-page">
      <div className="history-header">
        <h2>All Pomodoros</h2>
        {loading && <span className="history-status">Loading…</span>}
        {error && <span className="history-status error">{error}</span>}
      </div>

      {sessions.length === 0 && !loading ? (
        <p className="history-muted">
          No pomodoros logged yet. Complete and log some sessions from the timer page.
        </p>
      ) : (
        sortedDayKeys.map((dayKey) => (
          <div key={dayKey} className="history-day-group">
            <div className="history-day-header">
              <h4>{dayKey === 'Unknown' ? 'Unknown day' : formatDayLabel(dayKey)}</h4>
            </div>
            <ul className="history-list">
              {groupedByDay[dayKey].map((s) => (
                <li key={s.id} className="history-item">
                  <div className="history-main">
                    <div>
                      <span className="history-category">{s.category || 'Work'}</span>
                      <span className="history-time">
                        {formatTime(s.endedAt || s.createdAt)}
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
          </div>
        ))
      )}
    </div>
  );
}

export default AllPomodorosPage;


