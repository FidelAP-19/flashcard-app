# Flashcard Study App

A full-stack flashcard application for creating, studying, and sharing decks. Built as a portfolio project to demonstrate authentication, relational data modeling, analytics, and cloud deployment.

**Live Demo:** [flashcard-app-psi-eight.vercel.app](https://flashcard-app-psi-eight.vercel.app)

---

## Features

- **Authentication** — Register and log in with JWT-based auth. Passwords hashed with bcrypt. Protected routes on both frontend and backend.
- **Deck Management** — Create, view, and delete your own flashcard decks. Mark decks as public or private.
- **Card Management** — Add and delete cards within any deck you own.
- **Study Mode** — Flip cards, mark correct/incorrect, and log a scored study session on completion.
- **Explore** — Browse public decks created by other users and save them to your account.
- **Dashboard Analytics** — View your study streak, average score per deck, and most studied decks.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express |
| ORM | Sequelize |
| Database | PostgreSQL |
| Auth | JWT, bcrypt |
| Testing | Jest, Supertest |
| Deployment | Vercel (frontend), Railway (backend + database) |
| Containerization | Docker |

---

## Architecture

The backend follows a strict three-layer architecture:

```
Routes → Services → Repositories
```

- **Routes** — HTTP only. Parse input, call service, send response. No business logic.
- **Services** — All business logic, validation, authorization checks, and analytics.
- **Repositories** — All Sequelize queries. Services never touch Sequelize directly.
- **Middleware** — JWT verification middleware protects all non-public routes.

---

## Data Models

```
User
 ├── hasMany Deck
 ├── hasMany StudySession
 └── belongsToMany Deck (through SavedDeck)

Deck
 ├── belongsTo User
 ├── hasMany Card
 ├── hasMany StudySession
 └── belongsToMany User (through SavedDeck)

Card
 └── belongsTo Deck

SavedDeck (join table)
 ├── belongsTo User
 └── belongsTo Deck

StudySession
 ├── belongsTo User
 └── belongsTo Deck
```

---

## Auth Flow

```
Register → hash password (bcrypt) → store user → return JWT
Login → compare password to hash → return JWT
Client stores JWT in localStorage
Client sends JWT in Authorization header on every protected request
Server middleware verifies JWT → allows or rejects
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Log in |
| GET | /api/decks/public | No | Browse public decks |
| GET | /api/decks/mine | Yes | Get your decks |
| POST | /api/decks | Yes | Create a deck |
| DELETE | /api/decks/:id | Yes | Delete your deck |
| GET | /api/cards/deck/:id | Yes | Get cards in a deck |
| POST | /api/cards/deck/:id | Yes | Add a card |
| DELETE | /api/cards/:id | Yes | Delete a card |
| POST | /api/saved-decks/:deckId | Yes | Save a public deck |
| POST | /api/sessions | Yes | Log a study session |
| GET | /api/sessions/analytics/streak | Yes | Study streak |
| GET | /api/sessions/analytics/average-score | Yes | Avg score per deck |
| GET | /api/sessions/analytics/most-studied | Yes | Most studied decks |

---

## Local Development

### Prerequisites

- Node.js v22+
- PostgreSQL running locally

### Backend

```bash
cd server
npm install
```

Create a `.env` file:

```
DB_NAME=flashcard_db
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
PORT=3001
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev       # start server with nodemon
npm run seed      # seed the database with sample data
npm test          # run Jest tests
```

### Frontend

```bash
cd client
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:3001/api
```

```bash
npm run dev
```

---

## Deployment

- **Frontend** deployed to [Vercel](https://vercel.com)
- **Backend** containerized with Docker and deployed to [Railway](https://railway.app)
- **Database** managed PostgreSQL on Railway

Docker image built for `linux/amd64`:

```bash
docker buildx build --platform linux/amd64 -t username/flashcard-server:latest --push .
```

During development, the backend was also deployed to AWS EC2 with the database on AWS RDS — providing hands-on experience with VPC security groups, SSH, IAM, and cross-platform Docker builds.

---

## Testing

Three auth endpoint tests using Jest and Supertest:

```bash
cd server
npm test
```

- `POST /api/auth/register` — creates user and returns token
- `POST /api/auth/login` — returns token with valid credentials
- `GET /api/decks` — rejects request with no token (401)

---

## Project Background

This is my second full-stack portfolio project. New concepts introduced in this project:

- JWT authentication and bcrypt password hashing
- Protected routes and auth middleware
- Many-to-many associations with Sequelize (`belongsToMany` through a join table)
- Service layer analytics (streak, scoring, usage trends)
- Jest and Supertest for API testing
- Docker containerization and cross-platform builds
- AWS EC2, RDS, VPC, and security group configuration
- Railway and Vercel deployment pipeline
