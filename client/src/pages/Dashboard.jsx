import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStreak, getMostStudied, getAverageScore } from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
 // const [ statusBreakdown, setStatusBreakdown ] = useState(null);
    const [streak, setStreak] = useState(null);
    const [mostStudied, setMostStudied] = useState([]);
    const [averageScore, setAverageScore] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchAnalytics = async () => {
        try {
          const [streakRes, MostStudiedRes, avgScoreRes] = await Promise.all([
            getStreak(),
            getMostStudied(),
            getAverageScore(),
          ]);
          setStreak(streakRes.data);
          setMostStudied(MostStudiedRes.data);
          setAverageScore(avgScoreRes.data);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to load analytics')
        }
      };
      fetchAnalytics();
    }, []);


  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome back, {user?.name}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
        
        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '1.5rem' }}>
          <h3>Study Streak</h3>
          {streak ? (
            <>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{streak.streak} 🔥</p>
              <p style={{ color: '#888' }}>consecutive days</p>
            </>
          ) : <p>Loading...</p>}
        </div>

        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '1.5rem' }}>
          <h3>Average Score Per Deck</h3>
          {averageScore && averageScore.length > 0 ? (
            averageScore.slice(0, 3).map((item, index) => (
            <p key={index}>
            <strong>{item.title}</strong> — avg {item.average_score} correct per session ({item.sessions} sessions)
            </p>
            ))
            ) : (
              <p>No sessions yet</p>
            )}
            
          </div>

        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '1.5rem' }}>
          <h3>Most Studied Decks</h3>
          {mostStudied.length === 0 ? (
            <p>No sessions yet</p>
          ) : (
            mostStudied.slice(0, 3).map((item, index) => (
              <p key={index}>
                <strong>{item.title}</strong> — {item.sessions} sessions
              </p>
            ))
          )}
        </div>

      </div>
    </div>
  );    

  };
  
  export default Dashboard;