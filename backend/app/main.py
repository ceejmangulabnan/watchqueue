import requests
import os
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from db.database import engine, SessionLocal
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import DBAPIError, ProgrammingError
from db import models

load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
BASE_IMG_URL = os.getenv("BASE_IMG_URL")

app = FastAPI()
# Creates Database Tables from models schema
models.Base.metadata.create_all(bind=engine)

# Allows FastAPI to accept requests from localhost frontend
origins = [
    "http://127.0.0.1",
    "http://localhost",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Set-Cookie"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/test")
async def test():
    response = requests.get(f"{BASE_URL}/movie/popular?api_key={API_KEY}")
    return response.json()


@app.get("/movie/popular")
async def get_movie_popular():
    response = requests.get(f"{BASE_URL}/movie/popular?api_key={API_KEY}")
    return response.json()


class CreateUser(BaseModel):
    registerUsername: str
    registerPassword: str
    registerConfirmPassword: str
    registerEmail: str


# Test PostgresDB
@app.post("/user/register")
async def register_user(request_body: CreateUser, db: db_dependency):
    print(request_body)
    try:
        db_user = models.Users(
            username=request_body.registerUsername,
            password=request_body.registerPassword,
            email=request_body.registerEmail,
        )

        db.add(db_user)
        db.commit()
        return 200

    except ProgrammingError:
        raise HTTPException(
            status_code=422, detail="ProgrammingError: Incorrect request body"
        )
    except Exception as e:
        raise e
