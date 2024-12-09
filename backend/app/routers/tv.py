# Tv Router
from fastapi import APIRouter
from dotenv import load_dotenv
import requests
import os

router = APIRouter(prefix="/tv")

load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
BASE_IMG_URL = os.getenv("BASE_IMG_URL")


@router.get("/popular")
async def get_popular_tv():
    response = requests.get(f"{BASE_URL}/tv/popular?api_key={API_KEY}")
    return response.json()

@router.get("/{tv_id}")
async def get_tv_details(tv_id: int):
    response = requests.get(f"{BASE_URL}/tv/{tv_id}?api_key={API_KEY}")
    return response.json()
