import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCardsByDeck, createCard, deleteCard } from '../services/api';

const DeckDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCards = async () => {
    try {
      const res = await getCardsByDeck(id);
      setCards(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load cards');
    }
  };

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const handleAddCard = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await createCard(id, { front, back });
      setFront('');
      setBack('');
      setShowForm(false);
      fetchCards();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add card');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (cardId) => {
    try {
      await deleteCard(cardId);
      fetchCards();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete card');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/decks')}
            style={{ marginBottom: '0.5rem', padding: '0.3rem 0.5rem' }}
          >
            ← Back to My Decks
          </button>
          <h1 className="page-title">Deck Cards</h1>
          <p className="page-subtitle">{cards.length} card{cards.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-end' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '＋ Add Card'}
          </button>
          {cards.length > 0 && (
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/study/${id}`)}
            >
              ▶ Study Deck
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}

      {/* Add card form */}
      {showForm && (
        <div className="card" style={{ marginTop: '1.25rem' }}>
          <h3 className="section-title">New Card</h3>
          <form onSubmit={handleAddCard}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Front</label>
                <input
                  className="form-input"
                  placeholder="Question or term…"
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Back</label>
                <input
                  className="form-input"
                  placeholder="Answer or definition…"
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  required
                />
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={adding}>
                {adding ? 'Adding…' : 'Add Card'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards table */}
      <div className="card" style={{ marginTop: '1.25rem', padding: 0, overflow: 'hidden' }}>
        {cards.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem' }}>
            <span className="empty-state-icon">🃏</span>
            <h3 style={{ fontWeight: 600, color: 'var(--text-2)' }}>No cards yet</h3>
            <p>Add your first card to this deck</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '0.5rem' }}
              onClick={() => setShowForm(true)}
            >
              ＋ Add Card
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '1.5rem' }}>#</th>
                <th>Front</th>
                <th>Back</th>
                <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card, i) => (
                <tr key={card.id}>
                  <td style={{ paddingLeft: '1.5rem', color: 'var(--text-3)', width: '48px' }}>
                    {i + 1}
                  </td>
                  <td style={{ fontWeight: 500, color: 'var(--text-1)' }}>{card.front}</td>
                  <td>{card.back}</td>
                  <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(card.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DeckDetail;