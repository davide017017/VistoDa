from pathlib import Path
from dotenv import load_dotenv
import os

# Carica backend/.env
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .seeds.seed_users import seed_users
from .seeds.seed_demo_media import seed_demo_media
from .seeds.seed_admin_media import seed_admin_media
from .routers import auth, media

app = FastAPI()

ENV = os.getenv("ENV", "development")
FRONTEND_URL = os.getenv("FRONTEND_URL", "")

if ENV == "production" and not FRONTEND_URL:
    raise RuntimeError(
        "FRONTEND_URL is not set. "
        "Set FRONTEND_URL in your production environment variables."
    )

if ENV == "development":
    allow_origins = ["http://127.0.0.1:5500", "http://localhost:5500"]
else:
    allow_origins = [FRONTEND_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(media.router)

if os.getenv("AUTO_CREATE_TABLES") == "1":
    Base.metadata.create_all(bind=engine)
    seed_users()
    seed_demo_media()
    seed_admin_media()


@app.get("/")
def read_root():
    return {"message": "VistoDa API running"}
