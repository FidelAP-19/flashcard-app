const { SavedDeck, Deck, User } = require('../models');

const findByUserId = async (userId) => {
  return SavedDeck.findAll({
    where: { user_id: userId },
    include: [{ model: Deck, include: [{ model: User, attributes: ['id', 'name'] }] }],
  });
};

const findOne = async (userId, deckId) => {
  return SavedDeck.findOne({ where: { user_id: userId, deck_id: deckId } });
};

const create = async (userId, deckId) => {
  return SavedDeck.create({ user_id: userId, deck_id: deckId });
};

const remove = async (userId, deckId) => {
  const saved = await SavedDeck.findOne({ where: { user_id: userId, deck_id: deckId } });
  if (!saved) return null;
  await saved.destroy();
  return true;
};

module.exports = { findByUserId, findOne, create, remove };