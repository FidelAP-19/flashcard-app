import { useState, useEffect } from 'react';
import { getPublicDecks, saveDeck } from '../services/api';

const Explore = () => {
  const [decks, setDecks] = useState([]);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState({});

  const fetchPublicDecks = async () => {
    try {
      const res = await getPublicDecks();
      setDecks(res.data);
    } catch (err) {
      setError(err.response?.data?.error ||'Failed to load public decks');
    }
  };

  useEffect(() => {
    fetchPublicDecks();
  }, []);

  const handleSave = async (deckId) => {
    try {
      await saveDeck(deckId);
      setSaved((prev) => ({ ...prev, [deckId]: true }));
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to save deck';
      setSaved((prev) => ({ ...prev, [deckId]: msg }));
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Explore Public Decks</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {decks.length === 0 && <p>No public decks available.</p>}

      {decks.map((deck) => (
        <div key={deck.id} style={{ border: '1px solid #333', padding: '1rem', marginBottom: '1rem', borderRadius: '6px' }}>
          <h3>{deck.title}</h3>
          <p>{deck.description}</p>
          <p style={{ color: '#888' }}>By: {deck.User?.name}</p>

          {saved[deck.id] === true ? (
            <span style={{ color: 'green' }}>✓ Saved</span>
          ) : saved[deck.id] ? (
            <span style={{ color: 'orange' }}>{saved[deck.id]}</span>
          ) : (
            <button onClick={() => handleSave(deck.id)}>Save Deck</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Explore;