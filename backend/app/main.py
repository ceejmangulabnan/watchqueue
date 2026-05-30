from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from db.database import engine
from db import models
# from config import settings
from routers import users, watchlists, movies, search, tv, trending

load_dotenv()

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

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
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users.router)
app.include_router(watchlists.router)
app.include_router(movies.router)
app.include_router(search.router)
app.include_router(tv.router)
app.include_router(trending.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/log")
async def log():
    return {"uptime_robot": f"{datetime.now()}"}
