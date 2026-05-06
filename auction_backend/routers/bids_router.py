from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models, schemas

router = APIRouter(prefix="/bids", tags=["Bids"])


# ─── PLACE A BID (used by AuctionDetails.jsx handleBid) ──────────────────────
@router.post("/{auction_id}", response_model=schemas.BidOut)
def place_bid(
    auction_id: int,
    data: schemas.BidCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    auction = db.query(models.Auction).filter(models.Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    if auction.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot bid on your own auction")
    if auction.status != "Active":
        raise HTTPException(status_code=400, detail="Auction has ended")
    if datetime.utcnow() > auction.end_time:
        raise HTTPException(status_code=400, detail="Auction has expired")

    # Validate bid is higher than current highest
    highest = max((b.amount for b in auction.bids), default=auction.start_price)
    if data.amount <= highest:
        raise HTTPException(
            status_code=400,
            detail=f"Bid must be higher than current highest bid ₹{highest}"
        )

    bid = models.Bid(
        amount=data.amount,
        auction_id=auction_id,
        user_id=current_user.id,
    )
    db.add(bid)

    # Update participants count
    already_bid = db.query(models.Bid).filter(
        models.Bid.auction_id == auction_id,
        models.Bid.user_id == current_user.id
    ).count()
    if already_bid == 0:
        auction.participants += 1

    db.commit()
    db.refresh(bid)

    return {
        "id": bid.id,
        "amount": bid.amount,
        "user": current_user.name,
        "created_at": bid.created_at,
    }


# ─── GET ALL BIDS FOR AN AUCTION (top bidders list) ──────────────────────────
@router.get("/{auction_id}", response_model=List[schemas.BidOut])
def get_bids_for_auction(auction_id: int, db: Session = Depends(get_db)):
    auction = db.query(models.Auction).filter(models.Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")

    bids = (
        db.query(models.Bid)
        .filter(models.Bid.auction_id == auction_id)
        .order_by(models.Bid.amount.desc())
        .all()
    )
    return [
        {"id": b.id, "amount": b.amount, "user": b.bidder.name, "created_at": b.created_at}
        for b in bids
    ]


# ─── GET MY BIDS (used by Dashboard.jsx "Your Bids") ─────────────────────────
@router.get("/my/all")
def get_my_bids(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    bids = (
        db.query(models.Bid)
        .filter(models.Bid.user_id == current_user.id)
        .order_by(models.Bid.created_at.desc())
        .all()
    )
    return [
        {
            "id": b.id,
            "item": b.auction.title,
            "price": b.amount,
            "auction_id": b.auction_id,
        }
        for b in bids
    ]
