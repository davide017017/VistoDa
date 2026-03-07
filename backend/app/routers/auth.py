from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..security import verify_password, create_access_token
from ..dependencies import get_db, get_current_user, block_demo

import os

router = APIRouter(prefix="/auth", tags=["Auth"])


# -------------------------
# LOGIN
# -------------------------
@router.post("/login", response_model=schemas.Token)
def login(data: schemas.UserLogin, db: Session = Depends(get_db)):

    user: models.User | None = (
        db.query(models.User).filter(models.User.email == data.email).first()
    )

    if user is None or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(user.id)

    return {"access_token": token, "token_type": "bearer"}


# -------------------------
# GET CURRENT USER
# -------------------------
@router.get("/me", response_model=schemas.UserOut)
def get_me(user: models.User = Depends(get_current_user)):
    return user


# -------------------------
# UPDATE NICKNAME
# -------------------------
@router.patch("/me/nickname", response_model=schemas.NicknameOut)
def update_nickname(
    data: schemas.NicknameUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(block_demo),
):
    nickname = data.nickname.strip()
    if len(nickname) < 2:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Il nickname deve avere almeno 2 caratteri",
        )

    user.nickname = nickname
    db.commit()
    db.refresh(user)
    return {"nickname": user.nickname}


# -------------------------
# DEMO LOGIN
# -------------------------
@router.post("/demo", response_model=schemas.Token)
def demo_login(db: Session = Depends(get_db)):

    email = os.getenv("SEED_DEMO_EMAIL")
    password = os.getenv("SEED_DEMO_PASSWORD")

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Demo account not configured",
        )

    user: models.User | None = (
        db.query(models.User).filter(models.User.email == email).first()
    )

    if user is None or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Demo account error",
        )

    token = create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer"}
