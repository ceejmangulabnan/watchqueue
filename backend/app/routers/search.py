from fastapi import APIRouter
import os
from dotenv import load_dotenv
import requests

router = APIRouter(prefix="/search")

load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
BASE_IMG_URL = os.getenv("BASE_IMG_URL")

@router.get("/multi")
async def search_multi(query: str):
    response = requests.get(f"{BASE_URL}/search/multi?query={query}&api_key={API_KEY}")
    return response.json()
