import os, shutil
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models, schemas

router = APIRouter(prefix="/auctions", tags=["Auctions"])

UPLOAD_DIR = "uploads/auctions"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/", response_model=List[schemas.AuctionOut])
def get_all_auctions(db: Session = Depends(get_db)):
    auctions = db.query(models.Auction).order_by(models.Auction.created_at.desc()).all()
    return [_serialize_auction(a) for a in auctions]


# MUST be before /{auction_id}
@router.get("/my", response_model=List[schemas.AuctionOut])
def get_my_auctions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    auctions = (
        db.query(models.Auction)
        .filter(models.Auction.owner_id == current_user.id)
        .order_by(models.Auction.created_at.desc())
        .all()
    )
    return [_serialize_auction(a) for a in auctions]


@router.get("/live", response_model=List[schemas.AuctionOut])
def get_live_auctions(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    auctions = (
        db.query(models.Auction)
        .filter(models.Auction.end_time > now, models.Auction.status == "Active")
        .all()
    )
    return [_serialize_auction(a) for a in auctions]


@router.get("/{auction_id}", response_model=schemas.AuctionOut)
def get_auction(auction_id: int, db: Session = Depends(get_db)):
    auction = db.query(models.Auction).filter(models.Auction.id == auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    return _serialize_auction(auction)


@router.post("/", response_model=schemas.AuctionOut)
def create_auction(
    data: schemas.AuctionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if data.duration_seconds > 60 * 60 * 24 * 30:
        raise HTTPException(status_code=400, detail="Duration cannot exceed 30 days")
    end_time = datetime.utcnow() + timedelta(seconds=data.duration_seconds)
    auction = models.Auction(
        title=data.title, description=data.description, image=None,
        start_price=data.start_price, end_time=end_time, status="Active",
        company=data.company, age=data.age, condition=data.condition,
        owner_id=current_user.id,
    )
    db.add(auction)
    db.commit()
    db.refresh(auction)
    return _serialize_auction(auction)


@router.post("/upload", response_model=schemas.AuctionOut)
async def create_auction_with_image(
    title: str = Form(...),
    description: str = Form(""),
    start_price: float = Form(...),
    duration_seconds: int = Form(...),
    company: str = Form(""),
    age: str = Form(""),
    condition: str = Form(""),
    image: Optional[UploadFile] = File(default=None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if duration_seconds > 60 * 60 * 24 * 30:
        raise HTTPException(status_code=400, detail="Duration cannot exceed 30 days")

    image_path = None
    if image and image.filename:
        ext = os.path.splitext(image.filename)[-1]
        filename = f"{current_user.id}_{int(datetime.utcnow().timestamp())}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_path = f"http://localhost:8000/uploads/auctions/{filename}"

    end_time = datetime.utcnow() + timedelta(seconds=duration_seconds)
    auction = models.Auction(
        title=title, description=description, image=image_path,
        start_price=start_price, end_time=end_time, status="Active",
        company=company, age=age, condition=condition,
        owner_id=current_user.id,
    )
    db.add(auction)
    db.commit()
    db.refresh(auction)
    return _serialize_auction(auction)


@router.post("/close-expired")
def close_expired_auctions(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    expired = (
        db.query(models.Auction)
        .filter(models.Auction.end_time <= now, models.Auction.status == "Active")
        .all()
    )
    for a in expired:
        a.status = "Completed"
    db.commit()
    return {"closed": len(expired)}


def _serialize_auction(auction: models.Auction) -> dict:
    bids = [
        {
            "id": b.id,
            "amount": b.amount,
            "user": b.bidder.name if b.bidder else "Anonymous",
            "user_id": b.user_id,
            "created_at": b.created_at,
        }
        for b in auction.bids
    ]
    return {
        "id": auction.id, "title": auction.title, "description": auction.description,
        "image": auction.image, "start_price": auction.start_price, "end_time": auction.end_time,
        "status": auction.status, "participants": auction.participants, "company": auction.company,
        "age": auction.age, "condition": auction.condition, "owner_id": auction.owner_id, "bids": bids,
    }