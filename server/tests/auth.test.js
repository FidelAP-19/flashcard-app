const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/database');

beforeAll(async () => {
    await sequelize.authenticate();
});

afterAll(async () => {
    await sequelize.close();
});

describe('POST /api/auth/register', () => {
    test('creates a new user and returns a token', async () => {
        const res = await request (app)
        .post('/api/auth/register')
        .send({
            name: 'Test User',
            email: `testuser_${Date.now()}@example.com`,
            password: 'password123',
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.token).toBeDefined();
    });
});

describe('POST /api/auth/login', () => {
    const email = `logintest_${Date.now()}@example.com`;

    beforeAll(async () => {
        await request(app)
        .post('/api/auth/register')
        .send({ name:'Login Test', email, password: 'password123' });
    });

    test('returns a token with valid credentials', async () => {
        const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'password123' });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });
});

describe('Protected route', () => {
    test('rejects request with no token — returns 401', async () => {
      const res = await request(app).get('/api/decks');
  
      expect(res.statusCode).toBe(401);
    });
  });
  