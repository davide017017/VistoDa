import os
from .database import SessionLocal
from .models import User
from .auth import hash_password


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

        assert admin_email is not None
        assert admin_password is not None
        assert demo_email is not None
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
