import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=schemas.TokenResponse)
def signup(data: schemas.SignupRequest, db: Session = Depends(get_db)):
    # Check email already exists
    if db.query(models.User).filter(models.User.email == data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Generate unique ID (same format as your frontend: UID + 4 digits)
    unique_id = "UID" + str(random.randint(1000, 9999))
    # Make sure it's truly unique
    while db.query(models.User).filter(models.User.unique_id == unique_id).first():
        unique_id = "UID" + str(random.randint(1000, 9999))

    user = models.User(
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password),
        unique_id=unique_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "unique_id": user.unique_id,
        "name": user.name,
        "id": user.id,
    }


@router.post("/login", response_model=schemas.TokenResponse)
def login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=400, detail="Wrong credentials")
    if user.unique_id != data.unique_id:
        raise HTTPException(status_code=400, detail="Wrong credentials")
    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Wrong credentials")

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "unique_id": user.unique_id,
        "name": user.name,
        "id": user.id,
    }


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(__import__("auth").get_current_user)):
    return current_user
