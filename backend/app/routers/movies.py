from fastapi import APIRouter
from dotenv import load_dotenv
import httpx
import os

router = APIRouter(prefix="/movies")

load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
BASE_IMG_URL = os.getenv("BASE_IMG_URL")

client = httpx.AsyncClient(
    headers={"Authorization": f"Bearer {API_KEY}"},
)


@router.get("/popular")
async def get_movie_popular():
    response = await client.get(f"{BASE_URL}/movie/popular")
    return response.json()


@router.get("/top_rated")
async def get_movie_top_rated():
    response = await client.get(f"{BASE_URL}/movie/top_rated")
    return response.json()


@router.get("/{movie_id}")
async def get_movie_details(movie_id: int):
    response = await client.get(f"{BASE_URL}/movie/{movie_id}")
    return response.json()


@router.get("/{movie_id}/recommendations")
async def get_movie_recommendations(movie_id: int):
    response = await client.get(f"{BASE_URL}/movie/{movie_id}/recommendations")
    return response.json()
