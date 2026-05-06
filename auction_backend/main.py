from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from database import engine, Base
import models  # ensures all models are registered before create_all

from routers import auth_router, auctions_router, bids_router, items_router

# Create all tables
Base.metadata.create_all(bind=engine)

# Create upload dirs
os.makedirs("uploads/auctions", exist_ok=True)
os.makedirs("uploads/items", exist_ok=True)

app = FastAPI(
    title="Auction App API",
    description="Backend for the React auction app",
    version="1.0.0",
)

# ─── CORS — allow your React dev server ──────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite default
        "http://localhost:3000",   # CRA default
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── STATIC FILES (uploaded images) ──────────────────────────────────────────
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ─── ROUTERS ──────────────────────────────────────────────────────────────────
app.include_router(auth_router.router)
app.include_router(auctions_router.router)
app.include_router(bids_router.router)
app.include_router(items_router.router)


@app.get("/")
def root():
    return {"message": "Auction API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "ok"}
