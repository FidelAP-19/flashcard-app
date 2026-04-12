const { User } = require('../models');

const findByEmail = async (email) => {
    return User.findOne({ where: { email } });
};

const createUser = async (data) => {
    return User.create(data)
};

module.exports = { findByEmail, createUser };