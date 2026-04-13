const { StudySession, Deck, User } = require('../models');

const findByUserId = async (userId) => {
  return StudySession.findAll({
    where: { user_id: userId },
    include: [{ model: Deck, attributes: ['id', 'title'] }],
    order: [['studied_at', 'DESC']],
  });
};

const findById = async (id) => {
  return StudySession.findByPk(id, {
    include: [
      { model: Deck, attributes: ['id', 'title'] },
      { model: User, attributes: ['id', 'name'] },
    ],
  });
};

const create = async (data) => {
  return StudySession.create(data);
};

const findAll = async () => {
  return StudySession.findAll({
    include: [
      { model: Deck, attributes: ['id', 'title'] },
      { model: User, attributes: ['id', 'name'] },
    ],
  });
};

module.exports = { findByUserId, findById, create, findAll };