# Tv Router
from fastapi import APIRouter
from dotenv import load_dotenv
import httpx
import os

router = APIRouter(prefix="/tv")

load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
BASE_IMG_URL = os.getenv("BASE_IMG_URL")

client = httpx.AsyncClient(
    headers={"Authorization": f"Bearer {API_KEY}"},
)


@router.get("/popular")
async def get_tv_popular():
    response = await client.get(f"{BASE_URL}/tv/popular")
    return response.json()


@router.get("/top_rated")
async def get_tv_top_rated():
    response = await client.get(f"{BASE_URL}/tv/top_rated")
    return response.json()


@router.get("/{tv_id}")
async def get_tv_details(tv_id: int):
    response = await client.get(f"{BASE_URL}/tv/{tv_id}")
    return response.json()


@router.get("/{tv_id}/recommendations")
async def get_tv_recommendations(tv_id: int):
    response = await client.get(f"{BASE_URL}/tv/{tv_id}/recommendations")
    return response.json()
