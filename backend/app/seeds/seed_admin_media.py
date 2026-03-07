import json
from decimal import Decimal
from pathlib import Path
from ..database import SessionLocal
from ..models import User, Media

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "seed_media.json"


def seed_admin_media() -> None:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.is_demo == False).first()
        if not user:
            print("No admin user found, skipping admin media seed")
            return

        if db.query(Media).filter(Media.user_id == user.id).first():
            print("Admin media already seeded")
            return

        if not DATA_FILE.exists():
            print(f"Seed skipped: {DATA_FILE} not found")
            return

        with open(DATA_FILE, encoding="utf-8") as f:
            media_list = json.load(f)

        count = 0
        for item in media_list:
            rating = item.get("rating")
            db.add(
                Media(
                    user_id=user.id,
                    title=item["title"],
                    type=item["type"],
                    status=item["status"],
                    year=item.get("year"),
                    rating=Decimal(str(rating)) if rating is not None else None,
                    notes=item.get("notes"),
                )
            )
            count += 1

        db.commit()
        print(f"Seed OK: {count} admin media created")

    finally:
        db.close()
