import httpx
from fastapi import HTTPException
from starlette import status

from config import settings


class TMDBClient:
    def __init__(self):
        self.client = httpx.AsyncClient(
            headers={"Authorization": f"Bearer {settings.API_KEY}"},
            base_url=settings.BASE_URL,
        )

    async def close(self):
        await self.client.aclose()

    async def get(self, path: str, **kwargs):
        response = await self.client.get(path, **kwargs)
        if response.is_error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"TMDB API error: {response.status_code}",
            )
        return response.json()

    async def search_movies(self, query: str):
        return await self.get(f"/search/movie?query={query}")

    async def search_tv(self, query: str):
        return await self.get(f"/search/tv?query={query}")

    async def search_multi(self, query: str, page: int = 1):
        return await self.get(f"/search/multi?query={query}&page={page}")

    async def get_movie_popular(self):
        return await self.get("/movie/popular")

    async def get_movie_top_rated(self):
        return await self.get("/movie/top_rated")

    async def get_movie_details(self, movie_id: int):
        return await self.get(f"/movie/{movie_id}")

    async def get_movie_recommendations(self, movie_id: int):
        return await self.get(f"/movie/{movie_id}/recommendations")

    async def get_tv_popular(self):
        return await self.get("/tv/popular")

    async def get_tv_top_rated(self):
        return await self.get("/tv/top_rated")

    async def get_tv_details(self, tv_id: int):
        return await self.get(f"/tv/{tv_id}")

    async def get_tv_recommendations(self, tv_id: int):
        return await self.get(f"/tv/{tv_id}/recommendations")


tmdb = TMDBClient()
