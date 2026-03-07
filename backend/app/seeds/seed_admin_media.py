import json
from decimal import Decimal
from pathlib import Path
from datetime import datetime
from ..database import SessionLocal
from ..models import User, Media

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "admin"


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

        if not DATA_DIR.exists():
            print(f"Seed skipped: {DATA_DIR} not found")
            return

        count = 0
        for json_file in sorted(DATA_DIR.glob("*.json")):
            with open(json_file, encoding="utf-8") as f:
                media_list = json.load(f)

            for item in media_list:
                rating = item.get("rating")
                created_at_str = item.get("created_at")  # ← era updated_at
                db.add(
                    Media(
                        user_id=user.id,
                        title=item["title"],
                        type=item["type"],
                        status=item["status"],
                        year=item.get("year"),
                        rating=Decimal(str(rating)) if rating is not None else None,
                        notes=item.get("notes"),
                        created_at=(  # ← era updated_at
                            datetime.fromisoformat(created_at_str)
                            if created_at_str
                            else None
                        ),
                    )
                )
            count += 1

        db.commit()
        print(f"Seed OK: {count} admin media created")

    finally:
        db.close()
