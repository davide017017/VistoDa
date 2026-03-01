import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .seed import seed_users, seed_media
from .routers import auth, media

app = FastAPI()

ENV = os.getenv("ENV", "development")
FRONTEND_URL = os.getenv("FRONTEND_URL", "")

# 🔥 Errore esplicito in produzione
if ENV == "production" and not FRONTEND_URL:
    raise RuntimeError(
        "FRONTEND_URL is not set. "
        "Set FRONTEND_URL in your production environment variables."
    )

# 🌍 CORS config
if ENV == "development":
    allow_origins = [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ]
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
    seed_media()


@app.get("/")
def read_root():
    return {"message": "VistoDa API running"}
