# KISSAN Frontend

React web app for the KISSAN farmer marketplace — browse crops, add to cart, place orders, and check live mandi prices.

## Tech Stack

- React 18 + Vite
- React Router
- Context API (auth + cart)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start dev server (proxies /api to backend)
npm run dev
```

App runs at `http://localhost:5173`

**Make sure the backend is running on port 4000.**

## Features

- **Home** — Hero, category browse, featured listings
- **Shop** — Search, filter by category, pagination
- **Product Detail** — View crop info, add to cart
- **Cart & Checkout** — Place orders with shipping address
- **Farmer Dashboard** — List crops, manage inventory, view incoming orders
- **Mandi Prices** — Live wholesale prices from Indian mandis (public API)
- **Auth** — Separate farmer and buyer roles

## Demo Accounts

| Role   | Email              | Password     |
|--------|--------------------|--------------|
| Farmer | farmer@kissan.com  | password123  |
| Buyer  | buyer@kissan.com   | password123  |

## Environment

| Variable       | Default                    | Description        |
|----------------|----------------------------|--------------------|
| VITE_API_URL   | http://localhost:4000/api  | Backend API base   |

## Build for Production

```bash
npm run build
npm run preview
```
