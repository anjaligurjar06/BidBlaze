# 🏷️ Auction App

A full-stack real-time auction platform. Users can list items for auction and bid on live listings with countdown timers and outbid notifications.

**Stack:** React + Vite + Tailwind CSS (frontend) · FastAPI + SQLite + SQLAlchemy (backend)

---

## 📁 Project Structure

```
auction_backend/
├── main.py                  # FastAPI app, CORS, router registration
├── database.py              # SQLAlchemy engine & session
├── models.py                # DB models: User, Auction, Bid, Item
├── schemas.py               # Pydantic request/response schemas
├── auth.py                  # JWT creation, bcrypt hashing, auth dependency
├── DB_reset.py              # Drop & recreate all tables (dev utility)
├── auction.db               # SQLite database file (auto-created)
├── uploads/
│   ├── auctions/            # Uploaded auction images
│   └── items/               # Uploaded item images
└── routers/
    ├── auth_router.py       # /auth/signup, /auth/login, /auth/me
    ├── auctions_router.py   # /auctions/ CRUD + image upload
    ├── bids_router.py       # /bids/ place & fetch bids
    └── items_router.py      # /items/ list & manage items

auction_frontend/
└── src/
    ├── Pages/
    │   ├── Login.jsx          # Login with email + unique ID + password
    │   ├── Signup.jsx         # Register and receive a unique ID
    │   ├── Dashboard.jsx      # Overview of bids and listings
    │   ├── AuctionPage.jsx    # Seller view — manage your listings
    │   ├── BidZone.jsx        # Buyer view — browse & bid on auctions
    │   ├── Home.jsx           # Grid of live auction cards
    │   └── AuctionDetails.jsx # Live bidding page with timer
    ├── components/
    │   ├── AddAuction.jsx     # Form to create a new auction listing
    │   ├── AuctionCard.jsx    # Row card for seller's list
    │   ├── AuctionBidCard.jsx # Grid card for buyer's browser
    │   └── ItemModal.jsx      # Item detail modal
    ├── api.js                 # Fetch wrapper with JWT auth headers
    └── App.jsx                # Route definitions
```

---

## 🚀 Quick Start

### 1 — Backend

```bash
cd auction_backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at `http://localhost:8000`  
Swagger docs at `http://localhost:8000/docs`

### 2 — Frontend

```bash
cd auction_frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

> To reset the database during development: `python DB_reset.py`

---

## ✨ Features

- **Auth** — JWT-based signup/login; unique ID system as second factor
- **List Items** — Upload images, set starting price and auction duration
- **Live Timers** — Per-auction countdown updated every second on the frontend
- **Real-time Bidding** — Bid validation on both frontend and backend; polls every 5 seconds for updates
- **Outbid Alerts** — Toast notification when another user outbids you
- **Winner Display** — Shows winning bidder's name once auction closes
- **Dashboard** — See all your active bids and your own listings

---

## 🔐 Auth Flow

1. **Signup** → backend generates a `unique_id` (e.g. `UID4823`) — user must save it
2. **Login** requires email + unique_id + password
3. Backend returns a JWT (24hr expiry); stored in `localStorage`
4. All protected requests send `Authorization: Bearer <token>`

---

## 🔌 API Reference

### Auth — `/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | ❌ | Register; returns token + unique_id |
| POST | `/auth/login` | ❌ | Login; returns token |
| GET | `/auth/me` | ✅ | Get current user info |

### Auctions — `/auctions`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/auctions/` | ❌ | All auctions (newest first) |
| GET | `/auctions/my` | ✅ | Current user's own auctions |
| GET | `/auctions/live` | ❌ | Active auctions only |
| GET | `/auctions/{id}` | ❌ | Single auction with bids |
| POST | `/auctions/` | ✅ | Create auction (JSON) |
| POST | `/auctions/upload` | ✅ | Create auction with image (multipart) |
| POST | `/auctions/close-expired` | ❌ | Mark expired auctions as Completed |

### Bids — `/bids`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/bids/{auction_id}` | ✅ | Place a bid |
| GET | `/bids/{auction_id}` | ❌ | All bids for an auction (sorted by amount) |
| GET | `/bids/my/all` | ✅ | All bids placed by current user |

### Items — `/items`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/items/my` | ✅ | Current user's listed items |
| POST | `/items/` | ✅ | List a new item (multipart) |
| PATCH | `/items/{id}/status` | ✅ | Update status (Active / Pending / Sold) |

---

## 🗄️ Data Models

**User** — `id`, `name`, `email`, `hashed_password`, `unique_id`, `created_at`

**Auction** — `id`, `title`, `description`, `image`, `start_price`, `end_time`, `status`, `participants`, `company`, `age`, `condition`, `owner_id`

**Bid** — `id`, `amount`, `auction_id`, `user_id`, `created_at`

**Item** — `id`, `name`, `image`, `price`, `company`, `age`, `condition`, `description`, `status`, `owner_id`

---

## 🌐 Frontend Routes

| Path | Page |
|---|---|
| `/` | Login |
| `/signup` | Signup |
| `/dashboard` | Dashboard |
| `/list-item` | Seller — manage listings |
| `/bid-zone` | Buyer — browse auctions |
| `/bid-zone/auction/:id` | Live bidding page |

---

## 📝 Notes

- Auction `end_time` is computed by the backend from `duration_seconds` at creation time; the frontend only counts down from it
- Image uploads use `multipart/form-data` — do not set `Content-Type` manually on upload requests; let the browser set the boundary
- `POST /auctions/close-expired` can be called by a cron job or manually to mark timed-out auctions as Completed
- Change `SECRET_KEY` in `auth.py` before deploying — run `python -c "import secrets; print(secrets.token_hex(32))"` to generate one
- CORS is configured for `localhost:5173` and `localhost:3000` — update `allow_origins` in `main.py` for production
