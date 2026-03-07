# =========================================================
# Pydantic Schemas — VistoDa
# =========================================================
# Layer API:
# - Valida input
# - Definisce output
# - Filtra campi sensibili
# =========================================================

from datetime import datetime
from typing import Literal, Optional
from decimal import Decimal
from pydantic import BaseModel, EmailStr, Field


# =========================
# USER
# =========================


# Input registrazione
class UserCreate(BaseModel):
    email: EmailStr  # Email valida obbligatoria
    password: str = Field(min_length=6)


# Input login
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Output utente (mai includere password_hash)
class UserOut(BaseModel):
    id: int
    email: EmailStr
    nickname: str
    is_demo: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Risposta login
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Payload interno JWT
class TokenPayload(BaseModel):
    sub: Optional[int] = None


# Input modifica nickname
class NicknameUpdate(BaseModel):
    nickname: str = Field(min_length=1, max_length=30)


# Output modifica nickname
class NicknameOut(BaseModel):
    nickname: str


# Output config (token TMDB, ecc.)
class ConfigOut(BaseModel):
    tmdb_token: str


# =========================
# MEDIA
# =========================


# Base comune
class MediaBase(BaseModel):
    title: str = Field(min_length=1)
    type: Literal["film", "serie", "anime", "standup"]
    status: str
    year: Optional[int] = None
    rating: Optional[Decimal] = Field(None, ge=1, le=10, max_digits=4, decimal_places=2)
    notes: Optional[str] = None


# Input creazione
class MediaCreate(MediaBase):
    pass


# Input update (parziale)
class MediaUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[Literal["film", "serie", "anime", "standup"]] = None
    status: Optional[str] = None
    year: Optional[int] = None
    rating: Optional[Decimal] = Field(None, ge=1, le=10, max_digits=4, decimal_places=2)
    notes: Optional[str] = None


# Output media
class MediaOut(MediaBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
