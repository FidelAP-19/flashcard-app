const cardRepository = require('../repositories/cardRepository');
const deckRepository = require('../repositories/deckRepository');

const getCardsByDeck = async (deckId) => {
    return cardRepository.findByDeckId(deckId);
}

const getCardById = async (id) => {
    const card = await cardRepository.findById(id);
    if(!card){
        const error = new Error('Card not found');
        error.status = 404;
        throw error;
    }
    return card;
};

const createCard = async (deckId, data, userId) => {
    const deck = await deckRepository.findById(deckId);
    if(!deck){
        const error = new Error('Deck not found');
        error.status = 404;
        throw error;
    }
    if(deck.user_id !== userId){
        const error = new Error('Unauthorized - you do not own this deck');
        error.status = 403;
        throw error;
    }
    if(!data.front || !data.back){
        const error = new Error('front and back are required');
        error.status = 400;
        throw error;
    }
    return cardRepository.create({ ...data, deck_id: deckId});
};

const updateCard = async (id, data, userId) => {
    const card = await cardRepository.findById(id);
    if(!card){
        const error = new Error('Card not found');
        error.status = 404;
        throw error;
    }
    if(!card.Deck.user_id !== userId){
        const error = new Error('Unauthorized - you do not own this deck');
        error.status = 403;
        throw error;
    }
    return cardRepository.update(id, data);
};

const deleteCard = async (id, userId) => {
    const card = await cardRepository.findById(id);
    if(!card){
        const error = new Error('Card does not exist');
        error.status = 404;
        throw error;
    }
    if(card.Deck.user_id !== userId){
        const error = new Error('Unauthorized — you do not own this deck');
        error.status = 403;
        throw error;
    }
    await cardRepository.remove(id);
    return {message: 'Card deleted successfully'}
};

module.exports = { getCardsByDeck, getCardById, createCard, updateCard, deleteCard };
