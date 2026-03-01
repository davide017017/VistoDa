from sqlalchemy import (
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    ForeignKey,
    Numeric,
    CheckConstraint,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False)

    nickname: Mapped[str] = mapped_column(String(50), nullable=False)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    media: Mapped[list["Media"]] = relationship(
        back_populates="user", cascade="all, delete"
    )


class Media(Base):
    __tablename__ = "media"

    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 10", name="rating_between_1_10"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)

    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    rating: Mapped[Numeric | None] = mapped_column(Numeric(4, 2), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["User"] = relationship(back_populates="media")
