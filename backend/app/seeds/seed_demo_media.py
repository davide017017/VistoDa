from decimal import Decimal
from ..database import SessionLocal
from ..models import User, Media


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

        media_list = [
            # 🎬 FILM (completed)
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
            # 🎬 FILM (watching / recommended)
            {
                "title": "Dune: Part Two",
                "type": "film",
                "status": "watching",
                "year": 2024,
                "rating": None,
                "notes": "Da finire nel weekend",
            },
            {
                "title": "The Prestige",
                "type": "film",
                "status": "recommended",
                "year": 2006,
                "rating": None,
                "notes": "Consigliato da amici",
            },
            # 📺 SERIE (completed)
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
            # 📺 SERIE (watching / recommended)
            {
                "title": "Severance",
                "type": "serie",
                "status": "watching",
                "year": 2022,
                "rating": None,
                "notes": "In visione",
            },
            {
                "title": "The Bear",
                "type": "serie",
                "status": "recommended",
                "year": 2022,
                "rating": None,
                "notes": "Da vedere assolutamente",
            },
            # 🎌 ANIME (completed)
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
            # 🎌 ANIME (watching / recommended)
            {
                "title": "Frieren: Beyond Journey's End",
                "type": "anime",
                "status": "watching",
                "year": 2023,
                "rating": None,
                "notes": "Molto chill",
            },
            {
                "title": "Monster",
                "type": "anime",
                "status": "recommended",
                "year": 2004,
                "rating": None,
                "notes": "Capolavoro consigliato",
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
        print("Seed OK: demo media created")

    finally:
        db.close()
