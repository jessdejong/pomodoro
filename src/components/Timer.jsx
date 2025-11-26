import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../hooks/useAuth';
import Settings from './Settings';
import PomodoroLogModal from './PomodoroLogModal';
import PomodoroHistory from './PomodoroHistory';
import { addPomodoroSession } from '../services/pomodoroService';
import { playCompletionSound } from '../utils/sound';
import './Timer.css';

function Timer() {
  const { settings, updateSettings, resetSettings, isLoaded } = useSettings();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('work'); // 'work', 'shortBreak'
  const [sessionCount, setSessionCount] = useState(0);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [pendingLogSession, setPendingLogSession] = useState(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [todayCompletedCount, setTodayCompletedCount] = useState(0);
  const intervalRef = useRef(null);
  const sessionTypeRef = useRef(sessionType);
  const completedPomodorosRef = useRef(completedPomodoros);
  const currentWorkStartRef = useRef(null);

  // Keep refs in sync with state
  useEffect(() => {
    sessionTypeRef.current = sessionType;
  }, [sessionType]);

  useEffect(() => {
    completedPomodorosRef.current = completedPomodoros;
  }, [completedPomodoros]);

  // Convert minutes to seconds - memoized to avoid recalculation
  const workDuration = useMemo(() => settings.workDuration * 60, [settings.workDuration]);
  const shortBreakDuration = useMemo(() => settings.shortBreakDuration * 60, [settings.shortBreakDuration]);

  // Track previous settings to detect actual changes
  const prevSettingsRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Initialize timer when settings are loaded (only once)
  useEffect(() => {
    if (isLoaded && !isInitializedRef.current) {
      setTimeLeft(workDuration);
      isInitializedRef.current = true;
      prevSettingsRef.current = {
        workDuration: settings.workDuration,
        shortBreakDuration: settings.shortBreakDuration,
      };
    }
  }, [isLoaded, workDuration, settings]);

  // Reset timer when settings actually change (if not running)
  useEffect(() => {
    if (!isLoaded || !isInitializedRef.current) return;
    
    const prevSettings = prevSettingsRef.current;
    if (!prevSettings) return;

    // Check if settings actually changed
    const settingsChanged = 
      prevSettings.workDuration !== settings.workDuration ||
      prevSettings.shortBreakDuration !== settings.shortBreakDuration;

    // Only reset if settings changed AND timer is not running
    if (settingsChanged && !isRunning) {
      if (sessionType === 'work') {
        setTimeLeft(workDuration);
      } else {
        setTimeLeft(shortBreakDuration);
      }
      
      // Update ref with new settings
      prevSettingsRef.current = {
        workDuration: settings.workDuration,
        shortBreakDuration: settings.shortBreakDuration,
      };
    }
  }, [settings, isLoaded, sessionType, isRunning, workDuration, shortBreakDuration]);

  const handleSessionComplete = useCallback(() => {
    setIsRunning(false);
    
    // Play notification sound if enabled
    if (settings.soundEnabled) {
      playCompletionSound();
    }
    
    const currentType = sessionTypeRef.current;
    const currentCompleted = completedPomodorosRef.current;
    
    if (currentType === 'work') {
      const newCompleted = currentCompleted + 1;
      setCompletedPomodoros(newCompleted);

      // Prepare log info for this completed work session
      const endedAt = new Date();
      const durationSeconds = workDuration;
      const startedAt =
        currentWorkStartRef.current ||
        new Date(endedAt.getTime() - durationSeconds * 1000);
      currentWorkStartRef.current = null;

      setPendingLogSession({
        durationSeconds,
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        sessionNumber: newCompleted,
      });
      setShowLogModal(true);
      
      // Work session complete, start short break
      setSessionType('shortBreak');
      setTimeLeft(shortBreakDuration);
      
      // Request browser notification
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', { 
          body: 'Work session complete! Time for a break.' 
        });
      }
    } else {
      // Break completed, start work session
      setSessionType('work');
      setTimeLeft(workDuration);
      setSessionCount((prev) => prev + 1);
      
      // Request browser notification
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', { 
          body: 'Break complete! Ready to focus?' 
        });
      }
    }
  }, [settings.soundEnabled, shortBreakDuration, workDuration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, handleSessionComplete]);

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const toggleTimer = () => {
    setIsRunning((prev) => {
      const next = !prev;
      if (!prev && next && sessionType === 'work' && !currentWorkStartRef.current) {
        currentWorkStartRef.current = new Date();
      }
      return next;
    });
  };

  const resetTimer = () => {
    setIsRunning(false);
    currentWorkStartRef.current = null;
    if (sessionType === 'work') {
      setTimeLeft(workDuration);
    } else {
      setTimeLeft(shortBreakDuration);
    }
  };

  const skipSession = () => {
    if (window.confirm('Skip current session?')) {
      handleSessionComplete();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = sessionType === 'work' 
      ? workDuration
      : shortBreakDuration;
    return ((total - timeLeft) / total) * 100;
  };

  const getSessionTypeLabel = () => {
    if (sessionType === 'work') return 'Work Session';
    return 'Break';
  };

  const handleCloseLogModal = () => {
    setShowLogModal(false);
    setPendingLogSession(null);
  };

  const handleSaveLog = async ({ category, description }) => {
    if (!user || !pendingLogSession) {
      handleCloseLogModal();
      return;
    }

    try {
      await addPomodoroSession(user.uid, {
        category,
        description,
        durationSeconds: pendingLogSession.durationSeconds,
        startedAt: pendingLogSession.startedAt,
        endedAt: pendingLogSession.endedAt,
        sessionNumber: pendingLogSession.sessionNumber,
      });
      // Trigger history refresh
      setHistoryRefreshKey((k) => k + 1);
    } catch (error) {
      console.error('Error saving pomodoro session:', error);
      window.alert('Failed to save pomodoro. Please try again later.');
    } finally {
      handleCloseLogModal();
    }
  };

  if (!isLoaded) {
    return <div className="timer-container">Loading...</div>;
  }

  return (
    <div className="timer-container">
      <button 
        className="settings-button"
        onClick={() => setShowSettings(true)}
        title="Settings"
      >
        ⚙️
      </button>
      
      <div className="session-info">
        <div className="session-type">{getSessionTypeLabel()}</div>
        <div className="session-counter">
          {sessionType === 'work' && `Session ${sessionCount + 1}`}
        </div>
      </div>

      <div className="timer-display">
        <div className="timer-circle">
          <svg className="progress-ring" viewBox="0 0 100 100">
            <circle
              className="progress-ring-background"
              cx="50"
              cy="50"
              r="45"
            />
            <circle
              className="progress-ring-progress"
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDasharray: `${2 * Math.PI * 45}`,
                strokeDashoffset: `${2 * Math.PI * 45 * (1 - getProgress() / 100)}`,
              }}
            />
          </svg>
          <div className="timer-time">{formatTime(timeLeft)}</div>
        </div>
      </div>

      <div className="timer-controls">
        <button 
          className="btn btn-primary" 
          onClick={toggleTimer}
        >
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={resetTimer}
          disabled={isRunning}
        >
          ↻ Reset
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={skipSession}
        >
          ⏭ Skip
        </button>
      </div>

      <div className="stats">
        <div className="stat-item">
          <div className="stat-label">Completed Today</div>
          <div className="stat-value">{todayCompletedCount}</div>
        </div>
      </div>
      <PomodoroHistory
        refreshKey={historyRefreshKey}
        onTodayCountChange={setTodayCompletedCount}
      />

      {showSettings && (
        <Settings
          settings={settings}
          onUpdate={updateSettings}
          onReset={resetSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      <PomodoroLogModal
        isOpen={showLogModal}
        onClose={handleCloseLogModal}
        onSave={handleSaveLog}
        isLoggedIn={!!user}
        defaultCategory="Work"
      />
    </div>
  );
}

export default Timer;

