from fastapi import APIRouter
from services.tmdb import tmdb

router = APIRouter(prefix="/search")


@router.get("/movie")
async def search_movie(query: str):
    return await tmdb.search_movies(query)


@router.get("/tv")
async def search_show(query: str):
    return await tmdb.search_tv(query)


@router.get("/multi")
async def search_multi(query: str, page: int = 1):
    return await tmdb.search_multi(query, page)