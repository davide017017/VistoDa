import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # 👈 AGGIUNGI
from .database import engine, Base
from .seed import seed_users, seed_media
from .routers import auth, media

app = FastAPI()

# 🔥 CORS (per sviluppo frontend su Live Server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router DOPO aver creato app
app.include_router(auth.router)
app.include_router(media.router)

if os.getenv("AUTO_CREATE_TABLES") == "1":
    Base.metadata.create_all(bind=engine)
    seed_users()
    seed_media()


@app.get("/")
def read_root():
    return {"message": "VistoDa API running"}
