import os, shutil
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models, schemas

router = APIRouter(prefix="/items", tags=["Items"])

UPLOAD_DIR = "uploads/items"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ─── GET MY LISTED ITEMS (Dashboard "Your Items") ────────────────────────────
@router.get("/my", response_model=List[schemas.ItemOut])
def get_my_items(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    items = (
        db.query(models.Item)
        .filter(models.Item.owner_id == current_user.id)
        .order_by(models.Item.created_at.desc())
        .all()
    )
    return items


# ─── LIST A NEW ITEM (AuctionPage AddAuction form) ───────────────────────────
@router.post("/", response_model=schemas.ItemOut)
async def create_item(
    name: str = Form(...),
    price: float = Form(...),
    company: str = Form(""),
    age: str = Form(""),
    condition: str = Form(""),
    description: str = Form(""),
    duration_seconds: int = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    image_path = None
    if image and image.filename:
        ext = os.path.splitext(image.filename)[-1]
        filename = f"{current_user.id}_{int(datetime.utcnow().timestamp())}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_path = f"/{file_path}"

    item = models.Item(
        name=name,
        image=image_path,
        price=price,
        company=company,
        age=age,
        condition=condition,
        description=description,
        status="Active",
        owner_id=current_user.id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


# ─── UPDATE ITEM STATUS ───────────────────────────────────────────────────────
@router.patch("/{item_id}/status", response_model=schemas.ItemOut)
def update_item_status(
    item_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your item")
    if status not in ("Active", "Pending", "Sold"):
        raise HTTPException(status_code=400, detail="Invalid status")

    item.status = status
    db.commit()
    db.refresh(item)
    return item
