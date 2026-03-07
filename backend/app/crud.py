# =========================================================
# CRUD Layer — Media
# Responsabilità:
# - Accesso DB
# - Nessuna logica HTTP
# - Nessuna gestione JWT
# =========================================================

from sqlalchemy.orm import Session
from . import models, schemas


# -------------------------
# CREATE
# -------------------------
def create_media(db: Session, user_id: int, data: schemas.MediaCreate):
    media = models.Media(**data.model_dump(), user_id=user_id)
    db.add(media)
    db.commit()
    db.refresh(media)
    return media


# -------------------------
# LIST
# -------------------------
def get_user_media(db: Session, user_id: int):
    return (
        db.query(models.Media)
        .filter(models.Media.user_id == user_id)
        .order_by(models.Media.updated_at.desc(), models.Media.year.desc())
        .all()
    )


# -------------------------
# GET ONE
# -------------------------
def get_media(db: Session, user_id: int, media_id: int):
    return (
        db.query(models.Media)
        .filter(
            models.Media.id == media_id,
            models.Media.user_id == user_id,
        )
        .first()
    )


# -------------------------
# UPDATE
# -------------------------
def update_media(
    db: Session,
    media: models.Media,
    data: schemas.MediaUpdate,
):
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(media, key, value)

    db.commit()
    db.refresh(media)
    return media


# -------------------------
# DELETE
# -------------------------
def delete_media(db: Session, media: models.Media):
    db.delete(media)
    db.commit()
