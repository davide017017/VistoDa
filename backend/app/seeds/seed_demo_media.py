import json
from decimal import Decimal
from pathlib import Path
from datetime import datetime
from ..database import SessionLocal
from ..models import User, Media

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "demo" / "seed_media_all.json"


def seed_demo_media() -> None:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.is_demo == True).first()
        if not user:
            print("No demo user found, skipping demo media seed")
            return

        if db.query(Media).filter(Media.user_id == user.id).first():
            print("Demo media already seeded")
            return

        if not DATA_FILE.exists():
            print(f"Seed skipped: {DATA_FILE} not found")
            return

        with open(DATA_FILE, encoding="utf-8") as f:
            media_list = json.load(f)

        for item in media_list:
            rating = item.get("rating")
            updated_at_str = item.get("updated_at")
            db.add(
                Media(
                    user_id=user.id,
                    title=item["title"],
                    type=item["type"],
                    status=item["status"],
                    year=item.get("year"),
                    rating=Decimal(str(rating)) if rating is not None else None,
                    notes=item.get("notes"),
                    updated_at=(
                        datetime.fromisoformat(updated_at_str)
                        if updated_at_str
                        else None
                    ),
                )
            )

        db.commit()
        print("Seed OK: demo media created")

    finally:
        db.close()
