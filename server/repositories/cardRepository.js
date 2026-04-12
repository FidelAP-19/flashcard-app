const { Card, Deck } = require('../models')

const findByDeckId = async (deckId) => {
    return Card.findAll({ where: { deck_id: deckId } });
};

const findById = async (id) => {
    return Card.findByPk(id, {
        include: [{ model: Deck, attributes: ['id', 'title', 'user_id'] }],
    });
};

const create = async (data) => {
    return Card.create(data);
};

const update = async (id, data) => {
    const card = await Card.findByPk(id);
    if (!card) return null;
    return card.update(data);
};

const remove = async (id) => {
    const card = await Card.findByPk(id);
    if(!card) return null;
    await card.destroy();
    return true;
};

module.exports = { findByDeckId, findById, create, update, remove };
