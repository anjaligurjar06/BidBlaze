from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ─── AUTH ────────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    unique_id: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    unique_id: str
    name: str


# ─── USER ────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    unique_id: str

    class Config:
        from_attributes = True


# ─── BID ─────────────────────────────────────────────────────────────────────

class BidCreate(BaseModel):
    amount: float


class BidOut(BaseModel):
    id: int
    amount: float
    user: str          # bidder's name shown in frontend (like "You", "Rahul_K")
    created_at: datetime

    class Config:
        from_attributes = True


# ─── AUCTION ─────────────────────────────────────────────────────────────────

class AuctionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_price: float
    duration_seconds: int          # frontend sends duration, we compute end_time
    company: Optional[str] = None
    age: Optional[str] = None
    condition: Optional[str] = None


class AuctionOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    image: Optional[str]
    start_price: float
    end_time: datetime
    status: str
    participants: int
    company: Optional[str]
    age: Optional[str]
    condition: Optional[str]
    bids: List[BidOut] = []

    class Config:
        from_attributes = True


# ─── ITEM ─────────────────────────────────────────────────────────────────────

class ItemCreate(BaseModel):
    name: str
    price: float
    company: Optional[str] = None
    age: Optional[str] = None
    condition: Optional[str] = None
    description: Optional[str] = None
    duration_seconds: int


class ItemOut(BaseModel):
    id: int
    name: str
    image: Optional[str]
    price: float
    company: Optional[str]
    age: Optional[str]
    condition: Optional[str]
    description: Optional[str]
    status: str

    class Config:
        from_attributes = True
