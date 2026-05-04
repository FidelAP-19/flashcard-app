import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyDecks, createDeck, deleteDeck } from '../services/api';

const MyDecks = () => {
  const [decks, setDecks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDecks = async () => {
    try {
      const res = await getMyDecks();
      setDecks(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load decks');
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createDeck({ title, description, is_public: isPublic });
      setTitle('');
      setDescription('');
      setIsPublic(false);
      fetchDecks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create deck');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDeck(id);
      fetchDecks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete deck');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Decks</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: '2rem' }}>
        <h3>Create New Deck</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Make public
        </label>
        <button type="submit">Create Deck</button>
      </form>

      <div>
        {decks.length === 0 && <p>No decks yet. Create one above.</p>}
        {decks.map((deck) => (
          <div key={deck.id} style={{ border: '1px solid #333', padding: '1rem', marginBottom: '1rem', borderRadius: '6px' }}>
            <h3>{deck.title}</h3>
            <p>{deck.description}</p>
            <p>{deck.is_public ? 'Public' : 'Private'}</p>
            <button onClick={() => navigate(`/decks/${deck.id}`)}>View Cards</button>
            <button onClick={() => handleDelete(deck.id)} style={{ marginLeft: '1rem', color: 'red' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDecks;