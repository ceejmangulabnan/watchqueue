from fastapi import APIRouter
from services.tmdb import tmdb

router = APIRouter(prefix="/tv")


@router.get("/popular")
async def get_tv_popular():
    return await tmdb.get_tv_popular()


@router.get("/top_rated")
async def get_tv_top_rated():
    return await tmdb.get_tv_top_rated()


@router.get("/{tv_id}")
async def get_tv_details(tv_id: int):
    return await tmdb.get_tv_details(tv_id)


@router.get("/{tv_id}/recommendations")
async def get_tv_recommendations(tv_id: int):
    return await tmdb.get_tv_recommendations(tv_id)