const savedDeckRepository = require('../repositories/savedDeckRepository');
const deckRepository = require('../repositories/deckRepository');

const getSavedDecks = async (userId) => {
  return savedDeckRepository.findByUserId(userId);
};

const saveDeck = async (userId, deckId) => {
  const deck = await deckRepository.findById(deckId);
  if (!deck) {
    const error = new Error('Deck not found');
    error.status = 404;
    throw error;
  }
  const existing = await savedDeckRepository.findOne(userId, deckId);
  if (existing) {
    const error = new Error('Deck already saved');
    error.status = 409;
    throw error;
  }
  return savedDeckRepository.create(userId, deckId);
};

const unsaveDeck = async (userId, deckId) => {
  const result = await savedDeckRepository.remove(userId, deckId);
  if (!result) {
    const error = new Error('Saved deck not found');
    error.status = 404;
    throw error;
  }
  return { message: 'Deck removed from saved' };
};

const getMostSavedPublicDecks = async () => {
    const { SavedDeck, Deck, User } = require('../models');

    const results = await SavedDeck.findAll({
        include: [{
          model: Deck,
          where: { is_public: true },
          include: [{ model: User, attributes: ['id', 'name'] }],
        }],
      });
    
      const counts = results.reduce((acc, entry) => {
        const deckId = entry.deck_id;
        const deck = entry.Deck;
        if (!acc[deckId]) acc[deckId] = { deck, count: 0 };
        acc[deckId].count += 1;
        return acc;
      }, {});
    
      return Object.values(counts)
        .map(({ deck, count }) => ({ deck, saves: count }))
        .sort((a, b) => b.saves - a.saves);
}

module.exports = { getSavedDecks, saveDeck, unsaveDeck, getMostSavedPublicDecks };