import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyDecks, createDeck, deleteDeck } from '../services/api';

const MyDecks = () => {
  const [decks, setDecks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const fetchDecks = async () => {
    try {
      const res = await getMyDecks();
      setDecks(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load decks');
    }
  };

  useEffect(() => { fetchDecks(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createDeck({ title, description, is_public: isPublic });
      setTitle('');
      setDescription('');
      setIsPublic(false);
      setShowForm(false);
      fetchDecks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create deck');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this deck and all its cards?')) return;
    try {
      await deleteDeck(id);
      fetchDecks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete deck');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Decks</h1>
          <p className="page-subtitle">{decks.length} deck{decks.length !== 1 ? 's' : ''} in your library</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '＋ New Deck'}
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}

      {/* Create form */}
      {showForm && (
        <div className="card" style={{ marginTop: '1.25rem' }}>
          <h3 className="section-title">Create New Deck</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Spanish Vocabulary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <input
                  className="form-input"
                  placeholder="Optional description…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
              <label className="form-checkbox-row">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                Make this deck public (visible in Explore)
              </label>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={creating}
              >
                {creating ? 'Creating…' : 'Create Deck'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deck grid */}
      {decks.length === 0 ? (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="empty-state">
            <span className="empty-state-icon">🗂</span>
            <h3 style={{ font: 'var(--font-heading)', color: 'var(--text-2)', fontWeight: 600 }}>No decks yet</h3>
            <p>Create your first deck to get started</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '0.5rem' }}
              onClick={() => setShowForm(true)}
            >
              ＋ Create Deck
            </button>
          </div>
        </div>
      ) : (
        <div className="deck-grid">
          {decks.map((deck) => (
            <div key={deck.id} className="deck-card">
              <div>
                <div className="deck-card-meta" style={{ marginBottom: '0.5rem' }}>
                  <span className={`badge ${deck.is_public ? 'badge-success' : 'badge-neutral'}`}>
                    {deck.is_public ? '🌐 Public' : '🔒 Private'}
                  </span>
                </div>
                <h3 className="deck-card-title">{deck.title}</h3>
                <p className="deck-card-desc">
                  {deck.description || <span style={{ fontStyle: 'italic', color: 'var(--text-3)' }}>No description</span>}
                </p>
              </div>
              <div className="deck-card-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/decks/${deck.id}`)}
                >
                  View Cards
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(deck.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDecks;