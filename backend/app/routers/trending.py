from typing import Literal
from fastapi import APIRouter
from services.tmdb import tmdb

router = APIRouter(prefix='/trending')

@router.get("/all/{time_window}")
async def get_trending_all(time_window: Literal['day', 'week']):
    return await tmdb.get_trending_all(time_window)
