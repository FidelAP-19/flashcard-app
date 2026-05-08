import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStreak, getMostStudied, getAverageScore } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [streak, setStreak] = useState(null);
  const [mostStudied, setMostStudied] = useState([]);
  const [averageScore, setAverageScore] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [streakRes, mostStudiedRes, avgScoreRes] = await Promise.all([
          getStreak(),
          getMostStudied(),
          getAverageScore(),
        ]);
        setStreak(streakRes.data);
        setMostStudied(mostStudiedRes.data);
        setAverageScore(avgScoreRes.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load analytics');
      }
    };
    fetchAnalytics();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '0.25rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginBottom: '0.25rem' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="page-title">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">Here&apos;s a snapshot of your progress</p>
      </div>

      {error && <div className="alert alert-error" style={{ marginTop: '1.25rem' }}>{error}</div>}

      {/* Stat cards */}
      <div className="stats-grid">
        {/* Streak */}
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">
            {streak ? streak.streak : '—'}
          </div>
          <div className="stat-label">Day Streak</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.4rem' }}>
            {streak?.streak > 0 ? 'Keep it up!' : 'Study today to start a streak'}
          </p>
        </div>

        {/* Sessions */}
        <div className="stat-card" style={{ '--accent': '#16a34a' }}>
          <div className="stat-icon" style={{ background: 'var(--success-soft)' }}>📚</div>
          <div className="stat-value">
            {mostStudied.reduce((acc, d) => acc + Number(d.sessions), 0) || '—'}
          </div>
          <div className="stat-label">Total Sessions</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.4rem' }}>
            Across all your decks
          </p>
        </div>

        {/* Avg score */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>⭐</div>
          <div className="stat-value">
            {Array.isArray(averageScore) && averageScore.length > 0
              ? Math.round(averageScore.reduce((s, d) => s + Number(d.average_score), 0) / averageScore.length)
              : '—'}
          </div>
          <div className="stat-label">Avg. Correct / Session</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.4rem' }}>
            Best deck avg score
          </p>
        </div>
      </div>

      {/* Two-column section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.75rem' }}>

        {/* Most studied */}
        <div className="card">
          <h3 className="section-title">Most Studied Decks</h3>
          {mostStudied.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
              <span className="empty-state-icon">📖</span>
              <p>No sessions yet — study a deck to see data here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {mostStudied.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0.875rem',
                    background: 'var(--bg)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: 'var(--accent-soft)',
                      color: 'var(--accent)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-1)' }}>
                      {item.title}
                    </span>
                  </div>
                  <span className="badge badge-accent">{item.sessions} sessions</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avg score per deck */}
        <div className="card">
          <h3 className="section-title">Score Per Deck</h3>
          {!Array.isArray(averageScore) || averageScore.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
              <span className="empty-state-icon">🎯</span>
              <p>Complete a study session to see scores here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {averageScore.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.625rem 0.875rem',
                    background: 'var(--bg)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-1)' }}>
                      {item.title}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                      avg {item.average_score} correct
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <span className="badge badge-neutral">{item.sessions} sessions</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card" style={{ marginTop: '1.25rem' }}>
        <h3 className="section-title">Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/decks')}>
            ＋ Create New Deck
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/explore')}>
            ⊙ Explore Decks
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/decks')}>
            ▤ My Decks
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;