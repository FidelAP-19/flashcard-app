const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');

const SALT_ROUNDS = 10;

const register = async ({ name, email, password }) => {

    if (!name || !email || !password){
        const error = new Error('name, email, and password are required');
        error.status = 400;
        throw error;
    }

    const existing = await authRepository.findByEmail(email);
    if(existing){
        const error = new Error('Email already in use');
        error.status = 409;
        throw error;
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await authRepository.createUser({ name, email, password_hash });

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { token, user: { id: user.id, name: user.name, email: user.email }};
};

const login = async ({email, password}) => { 
    if(!email || !password){
        const error = new Error('email and password are required');
        error.status = 400;
        throw error;
    }

    const user = await authRepository.findByEmail(email);

    if(!user){
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if(!valid){
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return { token, user: { id: user.id, name: user.name, email: user.email }};
};

module.exports = { register, login };
