# Alzikrayat — MERN Edition + Project 4 (Track A: JWT Authentication)

A full-stack photo-sharing app: **React (Vite)** frontend, **Express** REST API, **MongoDB + Mongoose**.
Project 4 extends the Project 3 codebase with **Track A: JWT-Based Authentication**.

## Selected track and rationale
**Track A — JWT authentication.** In Project 3 the client identified itself by sending the user id in a header, which anyone could forge.
Now the server issues a signed, expiring JSON Web Token at register/login. Every write operation (upload, delete, comment) requires a valid `Authorization: Bearer <token>` header, so the server can trust who is making the request.

## How it works
1. `POST /api/auth/register` or `POST /api/auth/login` verifies the input, then returns `{ token, user }`. Passwords are hashed with bcrypt and never returned.
2. The token has three Base64URL parts: **header** (algorithm), **payload** (`sub` = user id, `iat`, `exp`) and **signature** (HMAC SHA-256 using `JWT_SECRET`). Tampering with the payload invalidates the signature.
3. The client stores the token in `localStorage` and an **Axios request interceptor** adds `Authorization: Bearer <token>` to every request.
4. The `requireUser` middleware verifies the signature and expiry, loads the user and sets `req.user`. It is applied to upload, delete and comment creation.
5. A **response interceptor** clears the session when the API answers 401 (expired or invalid token), and the navbar returns to "Please Login".
6. Logout removes the token and user from `localStorage`.

## Requirements
- Node.js 18+
- MongoDB (local instance or MongoDB Atlas)

## Setup

```bash
# API
cd server
npm install
cp .env.example .env        # then fill in the values below
npm run dev                 # http://localhost:5050

# Client (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to Express (see `client/vite.config.js`), so open http://localhost:5173.

### Environment variables (`server/.env`, never committed)
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `PORT` | API port (default 5050) |
| `JWT_SECRET` | Long random string used to sign tokens (the server will not start without it) |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `1d` or `2h` (default `1d`) |

Generate a secret with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## REST API
| Method | Route | Auth | Description | Success |
|---|---|---|---|---|
| POST | `/api/auth/register` | – | Validate (Joi), hash password (bcrypt), return JWT + profile | 201 |
| POST | `/api/auth/login` | – | Verify credentials, return JWT + profile | 200 |
| GET | `/api/photos` | – | List photos | 200 |
| GET | `/api/photos/:id` | – | One photo | 200 / 404 |
| POST | `/api/photos` | Bearer token | Upload (multipart: `image`, `title`, `description`) | 201 |
| DELETE | `/api/photos/:id` | Bearer token (owner) | Delete record, comments and file | 204 / 403 / 404 |
| GET | `/api/photos/:id/comments` | – | Comments of a photo | 200 |
| POST | `/api/photos/:id/comments` | Bearer token | Add comment | 201 |

Errors: 400 validation, 401 missing/invalid/expired token or wrong credentials, 403 not the owner, 404 not found, 409 duplicate email.

## Structure
```
server/  models/ routes/ controllers/ middleware/ uploads/ server.js
client/  src/components/ src/pages/ src/context/ App.jsx main.jsx api.js
```

## Notes
- The optional refresh-token flow was not implemented; when the token expires the user logs in again.
- `localStorage` is vulnerable to XSS; React escapes output by default and no user HTML is rendered.
