from fastapi import APIRouter
import os
from dotenv import load_dotenv
import requests

router = APIRouter(prefix="/movies")

load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
BASE_IMG_URL = os.getenv("BASE_IMG_URL")


@router.get("/")
async def movies():
    return {"message": "movies"}


@router.get("/popular")
async def get_movie_popular():
    response = requests.get(f"{BASE_URL}/movie/popular?api_key={API_KEY}")
    return response.json()


@router.get("/{movie_id}")
async def get_movie_details(movie_id: int):
    response = requests.get(f"{BASE_URL}/movie/{movie_id}?api_key={API_KEY}")
    return response.json()

@router.get("/{movie_id}/recommendations")
async def get_movie_recommendations(movie_id: int):
    response = requests.get(f"{BASE_URL}/movie/{movie_id}/recommendations?api_key={API_KEY}")
    return response.json()




