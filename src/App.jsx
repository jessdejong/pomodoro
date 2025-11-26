import React, { useState } from 'react';
import Timer from './components/Timer';
import AuthButton from './components/AuthButton';
import AllPomodorosPage from './components/AllPomodorosPage';
import './App.css';

function App() {
  const [view, setView] = useState('today'); // 'today' | 'all'

  return (
    <div className="app">
      <div className="global-auth">
        <AuthButton />
      </div>
      <header className="app-header">
        <h1>🍅 Pomodoro Timer</h1>
        <nav className="app-nav">
          <button
            type="button"
            className={`nav-tab ${view === 'today' ? 'active' : ''}`}
            onClick={() => setView('today')}
          >
            Today
          </button>
          <button
            type="button"
            className={`nav-tab ${view === 'all' ? 'active' : ''}`}
            onClick={() => setView('all')}
          >
            All Time
          </button>
        </nav>
      </header>
      <main>
        {view === 'today' ? <Timer /> : <AllPomodorosPage />}
      </main>
    </div>
  );
}

export default App;

