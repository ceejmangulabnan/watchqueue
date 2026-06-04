from fastapi import APIRouter
from services.tmdb import tmdb

router = APIRouter(prefix="/movies")

@router.get("/popular")
async def get_movie_popular():
    return await tmdb.get_movie_popular()


@router.get("/top_rated")
async def get_movie_top_rated():
    return await tmdb.get_movie_top_rated()


@router.get("/{movie_id}")
async def get_movie_details(movie_id: int):
    return await tmdb.get_movie_details(movie_id)


@router.get("/{movie_id}/recommendations")
async def get_movie_recommendations(movie_id: int):
    return await tmdb.get_movie_recommendations(movie_id)
