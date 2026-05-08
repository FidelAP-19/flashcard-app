import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCardsByDeck, logSession } from '../services/api';

const StudyMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await getCardsByDeck(id);
        setCards(res.data);
      } catch (err) {
        console.error('Failed to load cards', err);
      }
    };
    fetchCards();
  }, [id]);

  const handleFlip = () => setFlipped(!flipped);

  const handleNext = async (correct) => {
    const newScore = correct ? score + 1 : score;

    if (currentIndex + 1 >= cards.length) {
      try {
        await logSession({
          deck_id: parseInt(id),
          cards_reviewed: cards.length,
          score: newScore,
        });
      } catch (err) {
        console.error('Failed to log session', err);
      }
      setScore(newScore);
      setDone(true);
    } else {
      setScore(newScore);
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const progress = cards.length > 0 ? ((currentIndex) / cards.length) * 100 : 0;

  if (cards.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <span className="empty-state-icon" style={{ fontSize: '2rem' }}>⏳</span>
          <p>Loading cards…</p>
        </div>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / cards.length) * 100);
    return (
      <div className="page-container">
        <div style={{ maxWidth: 480, margin: '4rem auto', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
            {pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📖'}
          </div>
          <h1 className="page-title" style={{ textAlign: 'center' }}>Session Complete!</h1>
          <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Great work on finishing this deck
          </p>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>
                  {score}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Correct
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-1)' }}>
                  {cards.length - score}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Missed
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: pct >= 80 ? 'var(--success)' : 'var(--warning)' }}>
                  {pct}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Score
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => navigate(`/decks/${id}`)}>
              ← Back to Deck
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(`/decks/${id}`)}
            style={{ padding: '0.3rem 0.5rem', marginBottom: '0.375rem' }}
          >
            ← Exit
          </button>
          <h1 className="page-title">Study Mode</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>
            Card {currentIndex + 1} of {cards.length}
          </span>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginTop: '0.15rem' }}>
            {score} correct so far
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Card */}
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div
          className={`study-card${flipped ? ' flipped' : ''}`}
          onClick={handleFlip}
        >
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1rem',
                opacity: 0.5,
              }}
            >
              {flipped ? 'Answer' : 'Question'}
            </div>
            <div className="study-card-text">
              {flipped ? card.back : card.front}
            </div>
          </div>
        </div>

        {!flipped ? (
          <p className="study-hint">
            <span>👆</span> Tap the card to reveal the answer
          </p>
        ) : (
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              className="btn btn-danger btn-lg"
              onClick={() => handleNext(false)}
              style={{ flex: 1, maxWidth: 200 }}
            >
              ✗ Missed it
            </button>
            <button
              className="btn btn-success btn-lg"
              onClick={() => handleNext(true)}
              style={{ flex: 1, maxWidth: 200 }}
            >
              ✓ Got it
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMode;