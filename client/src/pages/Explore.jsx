import { useState, useEffect } from 'react';
import { getPublicDecks, saveDeck } from '../services/api';

const Explore = () => {
  const [decks, setDecks] = useState([]);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPublicDecks = async () => {
      try {
        const res = await getPublicDecks();
        setDecks(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load public decks');
      }
    };
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

  const filtered = decks.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore</h1>
          <p className="page-subtitle">Discover and save decks created by the community</p>
        </div>
      </div>

      {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}

      {/* Search */}
      <div style={{ marginTop: '1.5rem', marginBottom: '0.25rem' }}>
        <input
          className="form-input"
          placeholder="🔍  Search decks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {/* Results count */}
      {decks.length > 0 && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', marginTop: '0.625rem', marginBottom: '0' }}>
          {filtered.length} deck{filtered.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Deck grid */}
      {filtered.length === 0 ? (
        <div className="card" style={{ marginTop: '1.25rem' }}>
          <div className="empty-state">
            <span className="empty-state-icon">🌍</span>
            <h3 style={{ fontWeight: 600, color: 'var(--text-2)' }}>
              {decks.length === 0 ? 'No public decks yet' : 'No results found'}
            </h3>
            <p>
              {decks.length === 0
                ? 'Be the first to share a deck!'
                : 'Try a different search term'}
            </p>
          </div>
        </div>
      ) : (
        <div className="deck-grid">
          {filtered.map((deck) => (
            <div key={deck.id} className="deck-card">
              <div>
                <span className="badge badge-accent" style={{ marginBottom: '0.5rem' }}>🌐 Public</span>
                <h3 className="deck-card-title">{deck.title}</h3>
                <p className="deck-card-desc">
                  {deck.description || (
                    <span style={{ fontStyle: 'italic', color: 'var(--text-3)' }}>No description</span>
                  )}
                </p>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                By <strong style={{ color: 'var(--text-2)' }}>{deck.User?.name || 'Unknown'}</strong>
              </div>

              <div className="deck-card-actions">
                {saved[deck.id] === true ? (
                  <span className="badge badge-success" style={{ padding: '0.5rem 0.875rem' }}>
                    ✓ Saved to library
                  </span>
                ) : saved[deck.id] ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--warning)' }}>
                    {saved[deck.id]}
                  </span>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSave(deck.id)}
                  >
                    + Save Deck
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;