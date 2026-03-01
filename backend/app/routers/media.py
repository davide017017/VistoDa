from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas, crud
from ..dependencies import get_db, get_current_user, block_demo

router = APIRouter(prefix="/media", tags=["Media"])


# -------------------------
# CREATE
# -------------------------
@router.post("/", response_model=schemas.MediaOut)
def create(
    data: schemas.MediaCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(block_demo),
):
    return crud.create_media(db, user.id, data)


# -------------------------
# LIST
# -------------------------
@router.get("/", response_model=list[schemas.MediaOut])
def list_all(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    return crud.get_user_media(db, user.id)


# -------------------------
# GET ONE
# -------------------------
@router.get("/{media_id}", response_model=schemas.MediaOut)
def get_one(
    media_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    media = crud.get_media(db, user.id, media_id)

    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found",
        )

    return media


# -------------------------
# UPDATE
# -------------------------
@router.put("/{media_id}", response_model=schemas.MediaOut)
def update(
    media_id: int,
    data: schemas.MediaUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(block_demo),
):
    media = crud.get_media(db, user.id, media_id)

    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found",
        )

    return crud.update_media(db, media, data)


# -------------------------
# DELETE
# -------------------------
@router.delete("/{media_id}")
def delete(
    media_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(block_demo),
):
    media = crud.get_media(db, user.id, media_id)

    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found",
        )

    crud.delete_media(db, media)

    return {"message": "Deleted"}
