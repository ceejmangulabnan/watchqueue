from typing import Annotated
from fastapi.exceptions import HTTPException
import requests
import os
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from starlette.status import HTTP_401_UNAUTHORIZED
from db.database import engine, db_dependency
from sqlalchemy.exc import DBAPIError, ProgrammingError
from db import models
from routers import users, watchlists
from routers.users import get_current_user


load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
BASE_IMG_URL = os.getenv("BASE_IMG_URL")

app = FastAPI()
models.Base.metadata.create_all(bind=engine)
# Allows FastAPI to accept requests from localhost frontend
origins = [
    "http://127.0.0.1",
    "http://localhost",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "https://127.0.0.1",
    "https://localhost",
    "https://127.0.0.1:5173",
    "https://localhost:5173",
    "https://watchqueue.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["*"]
)


app.include_router(users.router)
app.include_router(watchlists.router)
# Creates Database Tables from models schema

user_dependency = Annotated[dict, Depends(get_current_user)]


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/movie/popular")
async def get_movie_popular():
    response = requests.get(f"{BASE_URL}/movie/popular?api_key={API_KEY}")
    return response.json()
