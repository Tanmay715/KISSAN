# KISSAN — Farmer Marketplace

Marketplace for farmers — **farmers sell crops directly** and **buyers order wheat, pulses, rice, and more**.

## Project Structure

| Folder | Description | Tech |
|--------|-------------|------|
| [kissan-backend](./kissan-backend) | REST API — auth, products, orders, mandi prices | Node.js, Express, Knex, SQLite/MySQL |
| [kissan-frontend](./kissan-frontend) | Web UI — shop, cart, farmer dashboard | React, Vite |

## Quick Start

### 1. Backend

```bash
cd kissan-backend
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

API: `http://localhost:4000`

### 2. Frontend

```bash
cd kissan-frontend
npm install
npm run dev
```

App: `http://localhost:5173`

## Demo Accounts

| Role   | Email              | Password     |
|--------|--------------------|--------------|
| Farmer | farmer@kissan.com  | password123  |
| Buyer  | buyer@kissan.com   | password123  |

## Public API Integration

Live mandi (wholesale market) prices are fetched from the [Indian Mandi Price API](https://mandi-api-production.up.railway.app), which sources data from **Agmarknet / data.gov.in** — the Government of India's agricultural price portal.

## Features

- **Farmers** — List crops, set prices, manage stock, confirm orders
- **Buyers** — Browse, search, filter, cart, checkout
- **Mandi Prices** — Compare your listing price with live wholesale rates
- **Categories** — Wheat, Pulses, Rice, Vegetables, Fruits, Spices

## Architecture

```
┌─────────────────┐     REST API      ┌─────────────────┐
│  kissan-frontend │ ◄──────────────► │  kissan-backend  │
│  React + Vite    │                  │  Express + Knex  │
└─────────────────┘                  └────────┬────────┘
                                              │
                                    ┌─────────┴─────────┐
                                    │  SQLite / MySQL   │
                                    └───────────────────┘
                                              │
                                    ┌─────────┴─────────┐
                                    │  Mandi Price API  │
                                    │  (Agmarknet data) │
                                    └───────────────────┘
```
