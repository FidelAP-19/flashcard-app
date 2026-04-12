const { Deck, User, Card } = require('../models');

const findAll = async () => {
  return Deck.findAll({
    include: [{ model: User, attributes: ['id', 'name'] }],
  });
};

const findById = async (id) => {
  return Deck.findByPk(id, {
    include: [
      { model: User, attributes: ['id', 'name'] },
      { model: Card },
    ],
  });
};

const findByUserId = async (userId) => {
  return Deck.findAll({
    where: { user_id: userId },
    include: [{ model: Card }],
  });
};

const findPublic = async () => {
  return Deck.findAll({
    where: { is_public: true },
    include: [{ model: User, attributes: ['id', 'name'] }],
  });
};

const create = async (data) => {
  return Deck.create(data);
};

const update = async (id, data) => {
  const deck = await Deck.findByPk(id);
  if (!deck) return null;
  return deck.update(data);
};

const remove = async (id) => {
  const deck = await Deck.findByPk(id);
  if (!deck) return null;
  await deck.destroy();
  return true;
};

module.exports = { findAll, findById, findByUserId, findPublic, create, update, remove };