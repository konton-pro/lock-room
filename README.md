# Lock Room

A secure vault for storing and sharing secrets with dual-layer end-to-end encryption.

**Hosted version:**
- Frontend: [lockroom.konton.pro](https://lockroom.konton.pro)
- API: [lockroom.api.konton.pro](https://lockroom.api.konton.pro)

---

## What is Lock Room?

Lock Room is a personal vault application where you can store sensitive data (passwords, API keys, notes, secrets) with strong encryption. The key property is that **the server never has access to your plaintext data** — all encryption and decryption happens in your browser.

---

## How Encryption Works

Lock Room uses a **dual-layer encryption** model: every piece of data is encrypted twice — once by the client (browser), once by the server.

### Layer 1 — Client-Side (Browser)

All encryption happens in the browser using the native **Web Cryptography API (SubtleCrypto)**.

- **Algorithm**: AES-256-GCM
- **Key Derivation**: PBKDF2 with 600,000 iterations + SHA-256
- Your password is used to derive a key, which encrypts a randomly generated **Master Key**
- The Master Key is what actually encrypts/decrypts your vault entries
- The server never receives your password or Master Key in plaintext

### Layer 2 — Server-Side

When the client sends encrypted data, the server re-encrypts it with its own key (`SERVER_MASTER_KEY`) before storing in the database.

- **Algorithm**: AES-256-GCM (Node.js `crypto` module)
- When you retrieve data, the server decrypts its layer and returns the client-encrypted blob, which your browser then decrypts with your Master Key

### Recovery Key

During registration, a **256-bit recovery key** is generated. This key:
- Is shown once and must be saved by the user
- Encrypts a copy of your Master Key on the server (double-encrypted with Layer 2)
- Allows account recovery if you forget your password

> **Summary**: Your data = encrypted by Master Key → encrypted by Server Key → stored. Even if the database is compromised, the data is unreadable without both your password and the server master key.

---

## Tech Stack

| | Technology |
|---|---|
| **Backend Runtime** | Bun |
| **Backend Framework** | Elysia |
| **Database** | PostgreSQL |
| **ORM** | Drizzle ORM |
| **Authentication** | JWT |
| **Frontend Framework** | React 19 |
| **Router** | TanStack Router |
| **Data Fetching** | TanStack Query |
| **Styling** | Tailwind CSS |
| **Encryption** | Web Crypto API (client), Node.js crypto (server) |

---

## API

The API is publicly accessible at `https://lockroom.api.konton.pro`. Swagger documentation is available at:

```
https://lockroom.api.konton.pro/swagger
```

### Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Register a new account | No |
| POST | `/auth/login` | Login and receive JWT + encrypted master key | No |
| POST | `/vault` | Create a vault entry | JWT |
| GET | `/vault` | List all vault entries (headers only) | JWT |
| GET | `/vault/:id` | Get a single vault entry | JWT |
| DELETE | `/vault/:id` | Delete a vault entry | JWT |

**Rate limits:**
- Auth endpoints: 5 requests/minute per user
- Global: 100 requests/minute per IP

---

## Self-Hosting

### Prerequisites

- Docker and Docker Compose
- A PostgreSQL database (external, not included in compose)
- A reverse proxy (Nginx, Caddy, Coolify, etc.)

### 1. Clone the repository

```bash
git clone https://github.com/your-user/lock-room.git
cd lock-room
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
NODE_ENV=production

# Database
DATABASE_URL=postgres://user:password@host:5432/lockroom

# Ports
API_PORT=3001
FRONT_PORT=3000

# Security — generate these values, never use defaults
JWT_SECRET=change_me_to_a_long_random_string
SERVER_MASTER_KEY=<64-char hex string>   # openssl rand -hex 32

# CORS — set to your frontend domain
CORS_ALLOWED_ORIGINS=https://lockroom.yourdomain.com

# Rate limiting
MAX_REQUESTS_PER_MINUTE=100
MAX_AUTH_REQUESTS_PER_MINUTE=5

# Frontend
VITE_API_URL=https://api.lockroom.yourdomain.com
VITE_APP_TITLE="Lock Room"
```

**Generate `SERVER_MASTER_KEY`:**

```bash
openssl rand -hex 32
```

> `SERVER_MASTER_KEY` must be exactly 64 hexadecimal characters (32 bytes). Keep this secret — losing it means losing access to all stored data.

### 3. Run database migrations

Before starting the app, run migrations against your PostgreSQL database:

```bash
cd lock-room-api
bunx drizzle-kit migrate
```

Or, if you prefer to push the schema directly (development):

```bash
bunx drizzle-kit push
```

### 4. Start with Docker Compose

```bash
docker compose up -d
```

This starts:
- `lock-room-api` on `API_PORT` (default 3001)
- `lock-room-front` on `FRONT_PORT` (default 3000)

> **Note**: The default `docker-compose.yml` uses the `coolify` external Docker network. If you're not using Coolify, replace `external: true` in the networks section with a local network, or remove the network configuration entirely.

### 5. Configure reverse proxy

Point your domains to the running containers:

- `lockroom.yourdomain.com` → port 3000
- `api.lockroom.yourdomain.com` → port 3001

---

## Development

### Backend

```bash
cd lock-room-api
cp .env.example .env  # configure your local DB
bun install
bun run dev
```

### Frontend

```bash
cd lock-room-front
pnpm install
pnpm dev
```

### Useful commands

```bash
# Backend
bun run lint
bun run format
bunx drizzle-kit generate   # generate migration from schema changes
bunx drizzle-kit migrate    # apply migrations

# Frontend
pnpm test
pnpm lint
pnpm check   # format + lint fix
```

---

## Security Notes

- The server never stores or transmits your plaintext password, Master Key, or recovery key
- PBKDF2 with 600,000 iterations makes brute-force attacks against your password expensive
- AES-256-GCM provides authenticated encryption — tampered ciphertext will fail to decrypt
- Rate limiting on auth endpoints mitigates credential stuffing
- All requests are XSS-sanitized on the server side
- If you lose your password **and** your recovery key, your data cannot be recovered

---

## License

MIT
