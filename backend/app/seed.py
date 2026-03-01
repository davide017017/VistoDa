import os
from decimal import Decimal
from .database import SessionLocal
from .models import User, Media
from .security import hash_password


def seed_users() -> None:
    db = SessionLocal()
    try:
        if db.query(User).first():
            return

        admin_email = os.getenv("SEED_ADMIN_EMAIL")
        admin_password = os.getenv("SEED_ADMIN_PASSWORD")
        demo_email = os.getenv("SEED_DEMO_EMAIL")
        demo_password = os.getenv("SEED_DEMO_PASSWORD")

        if not all([admin_email, admin_password, demo_email, demo_password]):
            print("Seed skipped: missing env variables")
            return

        assert admin_password is not None
        assert demo_password is not None

        admin = User(
            email=admin_email,
            password_hash=hash_password(admin_password),
            is_demo=False,
        )

        demo = User(
            email=demo_email,
            password_hash=hash_password(demo_password),
            is_demo=True,
        )

        db.add(admin)
        db.add(demo)
        db.commit()

        print("Seed OK: users created")

    finally:
        db.close()


def seed_media() -> None:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.is_demo == True).first()
        if not user:
            print("No demo user found, skipping media seed")
            return

        if db.query(Media).first():
            print("Media already seeded")
            return

        media_list = [
            # 🎬 FILM
            {
                "title": "Inception",
                "type": "film",
                "status": "completed",
                "year": 2010,
                "rating": Decimal("9.5"),
                "notes": "Mind bending masterpiece",
            },
            {
                "title": "Interstellar",
                "type": "film",
                "status": "completed",
                "year": 2014,
                "rating": Decimal("9.8"),
                "notes": "Hans Zimmer + Nolan = perfection",
            },
            # 📺 SERIE
            {
                "title": "Breaking Bad",
                "type": "serie",
                "status": "completed",
                "year": 2008,
                "rating": Decimal("10.0"),
                "notes": "One of the best series ever made",
            },
            {
                "title": "True Detective",
                "type": "serie",
                "status": "completed",
                "year": 2014,
                "rating": Decimal("9.2"),
                "notes": "Season 1 legendary",
            },
            # 🎌 ANIME
            {
                "title": "Attack on Titan",
                "type": "anime",
                "status": "completed",
                "year": 2013,
                "rating": Decimal("9.0"),
                "notes": "Epic storytelling",
            },
            {
                "title": "Death Note",
                "type": "anime",
                "status": "completed",
                "year": 2006,
                "rating": Decimal("9.7"),
                "notes": "Psychological brilliance",
            },
        ]

        for item in media_list:
            db.add(
                Media(
                    user_id=user.id,
                    title=item["title"],
                    type=item["type"],
                    status=item["status"],
                    year=item["year"],
                    rating=item["rating"],
                    notes=item["notes"],
                )
            )

        db.commit()
        print("Seed OK: media created")

    finally:
        db.close()
