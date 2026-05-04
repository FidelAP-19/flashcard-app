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

  if (cards.length === 0) return <p style={{ padding: '2rem' }}>Loading cards...</p>;

  if (done) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Session Complete!</h2>
        <p>Score: {score} / {cards.length}</p>
        <button onClick={() => navigate(`/decks/${id}`)}>Back to Deck</button>
        <button onClick={() => navigate('/dashboard')} style={{ marginLeft: '1rem' }}>Dashboard</button>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div style={{ padding: '2rem' }}>
      <p>Card {currentIndex + 1} of {cards.length}</p>

      <div
        onClick={handleFlip}
        style={{
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '3rem',
          textAlign: 'center',
          cursor: 'pointer',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          marginBottom: '2rem',
          background: flipped ? '#1a1a2e' : '#fff',
          color: flipped ? '#fff' : '#000',
        }}
      >
        {flipped ? card.back : card.front}
      </div>

      {!flipped && (
        <p style={{ color: '#888' }}>Click the card to reveal the answer</p>
      )}

      {flipped && (
        <div>
          <p>Did you get it right?</p>
          <button onClick={() => handleNext(true)} style={{ marginRight: '1rem', background: 'green', color: 'white', padding: '0.5rem 1.5rem' }}>
            ✓ Got it
          </button>
          <button onClick={() => handleNext(false)} style={{ background: 'red', color: 'white', padding: '0.5rem 1.5rem' }}>
            ✗ Missed it
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyMode;