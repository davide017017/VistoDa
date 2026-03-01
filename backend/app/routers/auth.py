from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..security import verify_password, create_access_token
from ..dependencies import get_db, get_current_user

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

    return {"access_token": token}


# -------------------------
# GET CURRENT USER
# -------------------------
@router.get("/me", response_model=schemas.UserOut)
def get_me(user: models.User = Depends(get_current_user)):
    return user
