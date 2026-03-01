# =========================================================
# Shared Dependencies
# Responsabilità:
# - Gestione DB session
# - Recupero utente autenticato
# =========================================================

from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Generator, Any

from .database import SessionLocal
from . import models
from .security import decode_token


# -------------------------
# DB session
# -------------------------
def get_db() -> Generator[Session, Any, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------
# Current authenticated user
# -------------------------
def get_current_user(
    authorization: str = Header(...),
    db: Session = Depends(get_db),
) -> models.User:

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError()

        user_id = decode_token(token)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user
