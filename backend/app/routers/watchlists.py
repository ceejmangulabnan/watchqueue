from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy import delete, select
from sqlalchemy.orm.attributes import flag_modified
from starlette import status
from db.models import Watchlists
from routers.users import user_dependency
from db.database import db_dependency
import requests
import os
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO

load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
BASE_IMG_URL = os.getenv("BASE_IMG_URL")

router = APIRouter(prefix="/watchlists")


@router.get("/")
async def watchlists():
    return {"message": "watchlists"}


class CreateWatchlist(BaseModel):
    title: str

class WatchlistItem(BaseModel):
    media_type: str
    id: int


async def get_watchlist_from_db(user: user_dependency, db: db_dependency, watchlist_id: int):
    watchlist_query = select(Watchlists).where(
            Watchlists.id == watchlist_id, Watchlists.user_id == user.get("id")
        )
    result = db.execute(watchlist_query)
    watchlist = result.scalar()
    return watchlist

# Create Watchlist
@router.post("/create")
async def create_watchlist(
    user: user_dependency, db: db_dependency, request: CreateWatchlist
):
    if user:
        try:
            new_watchlist = Watchlists(
                title=request.title, user_id=user.get("id"), items=[]
            )
            db.add(new_watchlist)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))


@router.get("/{watchlist_id}")
async def get_watchlist(user: user_dependency, db: db_dependency, watchlist_id: int):
    if user:
        try:
            watchlist = await get_watchlist_from_db(user, db, watchlist_id)

            if watchlist is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
            else:
                print(watchlist.statuses)
                return watchlist

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{watchlist_id}")
async def delete_watchlist(user: user_dependency, db: db_dependency, watchlist_id: int):
    if user:
        try:
            watchlist_query = delete(Watchlists).where(
                Watchlists.id == watchlist_id, Watchlists.user_id == user.get("id")
            )

            result = db.execute(watchlist_query)
            if result.rowcount == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Watchlist does not exist",
                )

            db.commit()
            return {"message": f"Watchlist {watchlist_id} was deleted successfully"}
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))


@router.get("/user/{user_id}")
async def get_user_watchlists_all(
    user_id: int, user: user_dependency, db: db_dependency
):
    if user:
        try:
            if user_id == user.get("id"):
                user_watchlists_query = select(Watchlists).where(
                    Watchlists.user_id == user.get("id")
                )

                results = db.execute(user_watchlists_query).all()

                user_watchlists = []
                for result in results:
                    user_watchlists.append(result[0])

                return user_watchlists

            else:
                user_watchlists_query = select(Watchlists).where(
                    Watchlists.user_id == user_id, ~Watchlists.is_private
                )
                results = db.execute(user_watchlists_query).all()

                user_watchlists = []
                for result in results:
                    user_watchlists.append(result[0])

                return user_watchlists

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))



@router.post("/{watchlist_id}/add")
async def add_to_watchlist(
    user: user_dependency, db: db_dependency, watchlist_id: int, watchlist_item: WatchlistItem
):
    if user:
        try:
            watchlist = await get_watchlist_from_db(user, db, watchlist_id)

            if watchlist is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist not found"
                )

            # Check if watchlist_item is already in the watchlist
            if any(
                item.get('id') == watchlist_item.id and 
                item.get('media_type') == watchlist_item.media_type 
                for item in watchlist.items
            ):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Item already exists in the watchlist"
                )


            # Append the new item to the existing items
            watchlist.items.append({
                'id': watchlist_item.id,
                'media_type': watchlist_item.media_type
            })

            flag_modified(watchlist, "items")

            db.add(watchlist)
            db.commit()
            return {
                "message": f"Watchlist Item {watchlist_item.id} has been added to Watchlist {watchlist_id}"
            }

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))


@router.delete('/{watchlist_id}/{media_type}/{item_id}')
async def remove_from_watchlist(watchlist_id: int, item_id: int, media_type: str, user: user_dependency, db: db_dependency ):
    if user:
        try:
            watchlist = await get_watchlist_from_db(user, db, watchlist_id)

            if watchlist is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist not found"
                )

            # Find the item to remove
            item_to_remove = next(
                (item for item in watchlist.items 
                 if item['id'] == item_id and item['media_type'] == media_type),
                None
            )

            if item_to_remove is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="Item is not in watchlist"
                )

            # Remove the item
            watchlist.items.remove(item_to_remove)

            flag_modified(watchlist, "items")

            db.add(watchlist)
            db.commit()
            return {
                "message": f"Item: {item_id} was successfully removed from watchlist: {watchlist_id}."
            }

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get('/{watchlist_id}/cover_image')
async def watchlist_cover_image(user: user_dependency, db: db_dependency, watchlist_id: int):
    # Get watchlist
    if user:
        try:
            watchlist = await get_watchlist_from_db(user, db, watchlist_id)

            if watchlist is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist not found"
                )

            # Get Poster URLS
            poster_urls = []
            for items in watchlist.items[:4]:
                if items["media_type"] == "movie":
                    response = requests.get(f"{BASE_URL}/movie/{items['id']}?api_key={API_KEY}")
                    movie_item = response.json()
                    poster_path = movie_item.get("poster_path")
                    if poster_path:
                        poster_urls.append(f"{BASE_IMG_URL}{poster_path}")
                    else:
                        poster_urls.append("https://placehold.co/400x600?text=Poster+Unavailable")
                elif items["media_type"] == "tv":
                    response = requests.get(f"{BASE_URL}/tv/{items['id']}?api_key={API_KEY}")
                    tv_item = response.json()
                    poster_path = tv_item.get("poster_path")
                    if poster_path:
                        poster_urls.append(f"{BASE_IMG_URL}{poster_path}")
                    else:
                        poster_urls.append("https://placehold.co/400x600?text=Poster+Unavailable")


            # Generate Image Grid using PIL
            images = []
            for image in poster_urls:
                response = requests.get(image)
                if response.status_code == 200:
                    img = Image.open(BytesIO(response.content))
                    images.append(img.resize((200, 300), Image.Resampling.LANCZOS))

            # Put the posters into a grid Image
            grid_size = (400, 600)  # 400x600 pixels
            grid = Image.new("RGB", grid_size)
            positions = [(0, 0), (200, 0), (0, 300), (200, 300)]

            for pos, img in zip(positions, images):
                grid.paste(img, pos)

            # Convert the grid image to a byte stream
            img_bytes = BytesIO()
            grid.save(img_bytes, format="JPEG")
            img_bytes.seek(0)

            return StreamingResponse(img_bytes, media_type="image/jpeg")

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
