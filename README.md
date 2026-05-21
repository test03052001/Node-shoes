# Node Shoes — Commercial Shoes Store API

Node.js + Express backend for a commercial shoes e-commerce website, backed by **MySQL**. All application logs and exceptions are written to a **single log file** (`logs/app.log`).

## Features

- Product catalog (shoes) with brands, sizes, colors, discounts, and stock
- Categories (Running, Casual, Formal, Sports, Kids)
- Order placement with stock deduction
- Search and filter shoes by category, brand, price, and keyword
- Request logging, error logging, and uncaught exception handling in one file

## Prerequisites

- Node.js 18+
- MySQL 8+

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and set your MySQL credentials:

   ```bash
   cp .env.example .env
   ```

3. **Initialize database**

   ```bash
   npm run db:init
   ```

4. **Start the server**

   ```bash
   npm run dev
   ```

   API base URL: `http://localhost:3000/api`

## Logging

All logs (info, warnings, errors, exceptions) go to **one file**:

| Setting   | Default        |
|-----------|----------------|
| `LOG_FILE` | `logs/app.log` |
| `LOG_LEVEL` | `info`      |

Logged events include:

- HTTP requests (method, URL, status, duration)
- API and database errors with stack traces
- Uncaught exceptions and unhandled promise rejections
- Server startup and shutdown

## API Endpoints

### Health

| Method | Endpoint       | Description   |
|--------|----------------|---------------|
| GET    | `/api/health`  | Health check  |

### Categories

| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| GET    | `/api/categories`     | List all categories |
| GET    | `/api/categories/:id` | Get category by ID  |

### Shoes

| Method | Endpoint        | Description                          |
|--------|-----------------|--------------------------------------|
| GET    | `/api/shoes`    | List shoes (supports query filters)  |
| GET    | `/api/shoes/:id`| Get shoe by ID                       |
| POST   | `/api/shoes`    | Create a new shoe                    |
| PUT    | `/api/shoes/:id`| Update a shoe                        |
| DELETE | `/api/shoes/:id`| Deactivate a shoe (soft delete)      |

**Query filters for `GET /api/shoes`:**

- `category` — category slug (e.g. `running`)
- `brand` — brand name
- `minPrice`, `maxPrice`
- `featured=true`
- `search` — keyword in name, brand, or description

### Orders

| Method | Endpoint                  | Description           |
|--------|---------------------------|-----------------------|
| GET    | `/api/orders`             | List all orders       |
| GET    | `/api/orders/:id`         | Get order details     |
| POST   | `/api/orders`             | Place a new order     |
| PATCH  | `/api/orders/:id/status`  | Update order status   |

## Example Requests

**List featured running shoes:**

```
GET /api/shoes?category=running&featured=true
```

**Create an order:**

```json
POST /api/orders
{
  "customer": {
    "email": "buyer@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890"
  },
  "shipping_address": "123 Main St, City, Country",
  "items": [
    { "shoe_id": 1, "quantity": 2 }
  ],
  "notes": "Leave at front door"
}
```

**Create a shoe:**

```json
POST /api/shoes
{
  "category_id": 1,
  "name": "Ultra Boost",
  "brand": "Adidas",
  "description": "Premium running shoe",
  "price": 159.99,
  "discount_percent": 10,
  "stock": 40,
  "size": "42",
  "color": "White",
  "image_url": "https://example.com/ultra-boost.jpg",
  "is_featured": true
}
```

## Project Structure

```
Node-shoes/
├── database/
│   └── schema.sql          # MySQL tables + seed data
├── logs/
│   └── app.log             # Single log file (auto-created)
├── scripts/
│   └── init-db.js          # Database setup script
├── src/
│   ├── config/
│   │   ├── database.js     # MySQL connection pool
│   │   └── logger.js       # Winston single-file logger
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── app.js
│   └── index.js
├── .env.example
└── package.json
```
