# Alzikrayat — MERN Edition

A full-stack photo-sharing app (Project 3, Advanced Web Technologies): **React (Vite)** frontend, **Express** REST API, **MongoDB + Mongoose**.
Rebuilt from the earlier PHP/MySQL version; the database design, upload rules, ownership checks and visual design were carried over.

## Requirements
- Node.js 18+
- MongoDB (local instance or a MongoDB Atlas connection string)

## Setup

```bash
# 1) API
cd server
npm install
cp .env.example .env        # then edit MONGODB_URI if needed
npm run dev                 # http://localhost:5050

# 2) Client (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to Express (see `client/vite.config.js`), so just open http://localhost:5173.

### Environment variables (`server/.env`, never committed)
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `PORT` | API port (default 5050) |

## REST API
| Method | Route | Auth | Description | Success |
|---|---|---|---|---|
| POST | `/api/auth/register` | – | Validate (Joi), hash password (bcrypt), create user | 201 |
| POST | `/api/auth/login` | – | Compare password with hash, return public profile | 200 |
| GET | `/api/photos` | – | List photos (newest first) | 200 |
| GET | `/api/photos/:id` | – | One photo | 200 / 404 |
| POST | `/api/photos` | user | Upload (multipart: `image`, `title`, `description`) | 201 |
| DELETE | `/api/photos/:id` | owner | Delete record, comments and file | 204 / 403 / 404 |
| GET | `/api/photos/:id/comments` | – | Comments of a photo | 200 |
| POST | `/api/photos/:id/comments` | user | Add comment | 201 |

Errors: 400 validation, 401 not logged in / wrong credentials, 403 not the owner, 404 not found, 409 duplicate email.

## Authentication note
Per the project scope this is **basic** authentication: after login the client keeps the user in React state + `localStorage` and sends the user id in an `x-user-id` header; the server loads that user to authorise writes and ownership checks. This is not spoofing-proof — JWT and protected-route middleware are the optional Bonus Project 4.

## Structure
```
server/  models/ routes/ controllers/ middleware/ uploads/ server.js
client/  src/components/ src/pages/ src/context/ App.jsx main.jsx api.js
```

## From PHP to MERN
| PHP version | MERN version |
|---|---|
| MySQL tables `users/photos/comments` | Mongoose models `User/Photo/Comment` (same fields, ObjectId refs) |
| `password_hash` | `bcrypt` |
| `finfo` MIME check, 5MB limit, random file names | `multer` (same rules) |
| Owner-only delete + file removal | `DELETE /api/photos/:id` with 403 check |
| PHP views + Bootstrap | React components + hand-written CSS (same palette) |
| Session cookie | React Context + `localStorage` |
