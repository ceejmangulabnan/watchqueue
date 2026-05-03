from fastapi import APIRouter
import os
from dotenv import load_dotenv
import httpx

router = APIRouter(prefix="/search")

load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
BASE_IMG_URL = os.getenv("BASE_IMG_URL")

client = httpx.AsyncClient(
    headers={"Authorization": f"Bearer {API_KEY}"},
)


@router.get("/movie")
async def search_movie(query: str):
    response = await client.get(f"{BASE_URL}/search/movie?query={query}")
    return response.json()


@router.get("/tv")
async def search_show(query: str):
    response = await client.get(f"{BASE_URL}/search/tv?query={query}")
    return response.json()


@router.get("/multi")
async def search_multi(query: str, page: int):
    response = await client.get(f"{BASE_URL}/search/multi?query={query}&page={page}")
    return response.json()
