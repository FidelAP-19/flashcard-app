import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCardsByDeck, createCard, deleteCard } from '../services/api';

const DeckDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cards, setCards] = useState([])
    const [front, setFront] = useState('')
    const [back, setBack] = useState('')
    const [error, setError] = useState(null)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchCards = async () => {
        try {
            const res = await getCardsByDeck(id);
            setCards(res.data)
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load cards');
        }
    };

    useEffect(() => {
        fetchCards();
    },[fetchCards])

    const handleAddCard = async (e) => {
        e.preventDefault();
        try{
            await createCard(id, { front, back });
            setFront('');
            setBack('');
            fetchCards();
        }catch(err){
            setError(err.response?.data?.error || 'Failed to add card')
        }
    };

    const handleDelete = async (cardId) => {
        try {
            await deleteCard(cardId);
            fetchCards();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete card')
            
        }
    };

    return(
        <div style={{ padding: '2rem' }}>
        <button onClick={() => navigate('/decks')}>← Back to My Decks</button>
        <h2>Deck Cards</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
  
        <form onSubmit={handleAddCard} style={{ marginBottom: '2rem' }}>
          <h3>Add New Card</h3>
          <input
            placeholder="Front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            required
          />
          <input
            placeholder="Back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            required
          />
          <button type="submit">Add Card</button>
        </form>
  
        <div>
          {cards.length === 0 && <p>No cards yet. Add one above.</p>}
          {cards.map((card) => (
            <div key={card.id} style={{ border: '1px solid #333', padding: '1rem', marginBottom: '1rem', borderRadius: '6px' }}>
              <p><strong>Front:</strong> {card.front}</p>
              <p><strong>Back:</strong> {card.back}</p>
              <button onClick={() => handleDelete(card.id)} style={{ color: 'red' }}>Delete</button>
            </div>
          ))}
        </div>
  
        {cards.length > 0 && (
          <button onClick={() => navigate(`/study/${id}`)}>Study This Deck</button>
        )}
      </div>
    );
};

export default DeckDetail;