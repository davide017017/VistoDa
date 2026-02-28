import os
from fastapi import FastAPI
from .database import engine, Base
from .models import User, Media
from .seed import seed_users

app = FastAPI()

if os.getenv("AUTO_CREATE_TABLES") == "1":
    Base.metadata.create_all(bind=engine)
    seed_users()


@app.get("/")
def read_root():
    return {"message": "VistoDa API running"}
