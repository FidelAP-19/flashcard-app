const deckRepository = require('../repositories/deckRepository');

const getAllDecks = async () => {
    return deckRepository.findAll
}

const getDeckById = async (id) => {
    const deck = await deckRepository.getDeckById(id);
    if (!deck) {
        const error = new Error('Deck not found');
        error.status(401)
        throw error;
    }
    return deck;
};

const getMyDecks = async (userId) => {
    return deckRepository.findByUserId(userId);
}

const getPublicDecks = async () => {
    return deckRepository.findPublic();
};

const createDeck = async (data, userId) => {
    if(!data.title) {
        const error = new Error('title is required');
        error.status = 400;
        throw error;
    }
    return deckRepository.create({...data, user_id: userId });
};

const updateDeck = async (id, data, userId) => {
    const deck = await deckRepository.findById(id);
    if (!deck) {
        const error = new Error('Deck not found');
        error.status = 404;
        throw error;
    }
    if (deck.user_id !== userId) {
        const error = new Error('Unauthorized — you do not own this deck');
        error.status = 403;
        throw error;
    }
    return deckRepository.update(id, data);
};

const deleteDeck = async (id, userId) => {
    const deck = await deckRepository.findById(id);
    if(!deck) {
        const error = new Error('Deck not found');
        error.status = 404;
        throw error;
    }
    if (deck.user_id !== userId) {
        const error = new Error('Unauthorized = you do not own this deck');
        error.status = 403;
        throw error;
    }
    await deckRepository.remove(id);
    return { message : 'Deck deleted successfully'};
};

module.exports = {
    getAllDecks,
    getDeckById,
    getMyDecks,
    getPublicDecks,
    createDeck,
    updateDeck,
    deleteDeck,
  };