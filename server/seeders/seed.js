const { faker } = require('@faker-js/faker');
const sequelize = require('../config/database');
const { User, Deck, Card, SavedDeck, StudySession } = require('../models');

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const NUM_USERS = 5;
const NUM_DECKS = 20;
const NUM_CARDS_PER_DECK = 10;
const NUM_SESSIONS = 30;

const TOPICS = ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Python', 'Data Structures', 'CSS', 'TypeScript'];

const seed = async () => {
    try{
        await sequelize.sync({ force: true });
        console.log('Database synced.');

        //Users
        const users = await User.bulkCreate(
            Array.from({ length: NUM_USERS }, () => ({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password_hash: faker.internet.password(), // placeholder
            }))
        );
        console.log(`Created ${users.length} users.`);

        //Decks
        const decks = await Deck.bulkCreate(
            Array.from({ length: NUM_DECKS }, () => ({
                user_id: randomFrom(users).id,
                title: `${randomFrom(TOPICS)} Flashcards`,
                description: faker.lorem.sentence(),
                is_public: faker.datatype.boolean(),
            }))
        );
        console.log(`Created ${decks.length} decks.`);

        //Cards
        const cards = [];
        for (const deck of decks) {
          for (let i = 0; i < NUM_CARDS_PER_DECK; i++) {
            cards.push({
              deck_id: deck.id,
              front: faker.lorem.sentence() + '?',
              back: faker.lorem.sentence(),
            });
          }
        }
        await Card.bulkCreate(cards);
        console.log(`Created ${cards.length} cards.`);
    
        // SavedDecks (many-to-many)
        const savedDecks = [];
        for (const user of users) {
          const randomDecks = decks.sort(() => 0.5 - Math.random()).slice(0, 4);
          for (const deck of randomDecks) {
            savedDecks.push({ user_id: user.id, deck_id: deck.id });
          }
        }
        await SavedDeck.bulkCreate(savedDecks, { ignoreDuplicates: true });
        console.log(`Created ${savedDecks.length} saved deck entries.`);
    
        // StudySessions
        const sessions = await StudySession.bulkCreate(
          Array.from({ length: NUM_SESSIONS }, () => ({
            user_id: randomFrom(users).id,
            deck_id: randomFrom(decks).id,
            cards_reviewed: faker.number.int({ min: 5, max: 20 }),
            score: faker.number.float({ min: 0.5, max: 1.0, fractionDigits: 2 }),
            studied_at: faker.date.between({ from: '2025-01-01', to: '2026-04-01' }),
          }))
        );
        console.log(`Created ${sessions.length} study sessions.`);
    
        console.log('Seed complete.');
        process.exit(0);

    }catch(err){
        console.error('Seed failed:', err);
        process.exit(1);
    }
};

seed();