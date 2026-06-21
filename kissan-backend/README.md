# KISSAN Backend

REST API for the KISSAN farmer marketplace — farmers list crops, buyers place orders, and live mandi prices come from a public Agmarknet wrapper.

## Tech Stack

- Node.js + Express
- MySQL 8 + Knex.js
- JWT authentication
- [Indian Mandi Price API](https://mandi-api-production.up.railway.app) (Agmarknet / data.gov.in data)

## Quick Start

### Option A — SQLite (zero config, recommended for local dev)

```bash
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

### Option B — MySQL with Docker

```bash
docker compose up -d
# Set DB_CLIENT=mysql in .env
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

API runs at `http://localhost:4000`

## Demo Accounts

| Role   | Email              | Password     |
|--------|--------------------|--------------|
| Farmer | farmer@kissan.com  | password123  |
| Buyer  | buyer@kissan.com   | password123  |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register as farmer or buyer
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Current user profile

### Products
- `GET /api/products` — Browse products (search, filter, paginate)
- `GET /api/products/:id` — Product details
- `POST /api/products` — Create product (farmer only)
- `PUT /api/products/:id` — Update product (farmer only)
- `DELETE /api/products/:id` — Delete product (farmer only)
- `GET /api/products/farmer/my-products` — Farmer's listings

### Orders
- `POST /api/orders` — Place order (buyer only)
- `GET /api/orders/my-orders` — Buyer's orders
- `GET /api/orders/farmer-orders` — Farmer's incoming orders
- `PATCH /api/orders/:id/status` — Update order status

### Mandi Prices (Public API)
- `GET /api/mandi/prices?crop=wheat&state=kerala` — Search mandi prices
- `GET /api/mandi/prices/state/:state` — Prices by state
- `GET /api/mandi/prices/crop/:crop` — Prices by crop

### Categories
- `GET /api/categories` — List crop categories

## Environment Variables

See `.env.example` for all configuration options.
