from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    unique_id = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    auctions = relationship("Auction", back_populates="owner")
    bids = relationship("Bid", back_populates="bidder")
    items = relationship("Item", back_populates="owner")


class Auction(Base):
    __tablename__ = "auctions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String, nullable=True)          # stores file path or URL
    start_price = Column(Float, nullable=False)
    end_time = Column(DateTime, nullable=False)    # when the auction closes
    status = Column(String, default="Active")      # Active / Completed
    participants = Column(Integer, default=0)
    company = Column(String, nullable=True)
    age = Column(String, nullable=True)
    condition = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="auctions")
    bids = relationship("Bid", back_populates="auction", cascade="all, delete-orphan")


class Bid(Base):
    __tablename__ = "bids"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    auction_id = Column(Integer, ForeignKey("auctions.id"))
    auction = relationship("Auction", back_populates="bids")

    user_id = Column(Integer, ForeignKey("users.id"))
    bidder = relationship("User", back_populates="bids")


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    image = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    company = Column(String, nullable=True)
    age = Column(String, nullable=True)
    condition = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="Pending")     # Pending / Sold / Active
    created_at = Column(DateTime, default=datetime.utcnow)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="items")
