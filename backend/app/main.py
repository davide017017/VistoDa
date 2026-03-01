import os
from fastapi import FastAPI
from .database import engine, Base
from .seed import seed_users
from .routers import auth, media

app = FastAPI()

# Include router DOPO aver creato app
app.include_router(auth.router)
app.include_router(media.router)

if os.getenv("AUTO_CREATE_TABLES") == "1":
    Base.metadata.create_all(bind=engine)
    seed_users()


@app.get("/")
def read_root():
    return {"message": "VistoDa API running"}
