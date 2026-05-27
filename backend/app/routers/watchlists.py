from typing import Annotated, cast
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import delete, select
from sqlalchemy.orm.attributes import flag_modified
from starlette import status

from db.models import Watchlists, WatchlistItemData
from db.database import db_dependency
from schemas.watchlist import CreateWatchlist, WatchlistItem, UpdateItemStatus, UpdateItemTags
from dependencies import user_dependency

router = APIRouter(prefix="/watchlists")

async def get_watchlist_from_db(
    user: user_dependency, db: db_dependency, watchlist_id: int
):
    watchlist_query = select(Watchlists).where(
        Watchlists.id == watchlist_id, Watchlists.user_id == user.get("id")
    )
    result = db.execute(watchlist_query)
    watchlist = result.scalar()

    if watchlist is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return watchlist


watchlist_dependency = Annotated[Watchlists, Depends(get_watchlist_from_db)]


@router.get("/")
async def watchlists():
    return {"message": "watchlists"}


@router.post("/create")
async def create_watchlist(
    user: user_dependency, db: db_dependency, request: CreateWatchlist
):
    new_watchlist = Watchlists(
        title=request.title, user_id=user.get("id"), items=[]
    )
    db.add(new_watchlist)
    db.commit()
    return {"message": "Watchlist created successfully"}


@router.get("/{watchlist_id}")
async def get_watchlist(watchlist: watchlist_dependency):
    return watchlist


@router.delete("/{watchlist_id}")
async def delete_watchlist(user: user_dependency, db: db_dependency, watchlist_id: int):
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


@router.get("/user/{user_id}")
async def get_user_watchlists_all(
    user_id: int, user: user_dependency, db: db_dependency
):
    if user_id == user.get("id"):
        query = select(Watchlists).where(Watchlists.user_id == user.get("id"))
    else:
        query = select(Watchlists).where(
            Watchlists.user_id == user_id, ~Watchlists.is_private
        )

    results = db.execute(query).all()
    return [row[0] for row in results]


@router.post("/{watchlist_id}/add")
async def add_to_watchlist(
    db: db_dependency,
    watchlist: watchlist_dependency,
    watchlist_id: int,
    watchlist_item: WatchlistItem,
):
    if any(
        item["id"] == watchlist_item.id and item["media_type"] == watchlist_item.media_type
        for item in watchlist.items
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Item already exists in the watchlist",
        )

    watchlist.items.append(cast(WatchlistItemData, watchlist_item.model_dump()))
    flag_modified(watchlist, "items")
    db.add(watchlist)
    db.commit()

    return {
        "message": f"Watchlist Item {watchlist_item.id} has been added to Watchlist {watchlist_id}"
    }


@router.put("/{watchlist_id}/tags")
async def edit_tags(
    db: db_dependency, watchlist: watchlist_dependency, tags: list[str]
):
    if not watchlist.all_tags == tags:
        watchlist.all_tags = tags

    flag_modified(watchlist, "all_tags")
    db.add(watchlist)
    db.commit()
    return watchlist.all_tags


@router.put("/{watchlist_id}/item/status")
async def update_status_tags(
    db: db_dependency, watchlist_item: UpdateItemStatus, watchlist: watchlist_dependency
):
    matching_item = next(
        (
            item
            for item in watchlist.items
            if item["id"] == watchlist_item.id and item["media_type"] == watchlist_item.media_type
        ),
        None,
    )

    if not matching_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No matches found for Watchlist Item.",
        )

    matching_item["status"] = watchlist_item.status
    flag_modified(watchlist, "items")
    db.add(watchlist)
    db.commit()


@router.put("/{watchlist_id}/item/tags")
async def edit_item_tags(
    db: db_dependency, watchlist_item: UpdateItemTags, watchlist: watchlist_dependency
):
    matching_item = next(
        (
            item
            for item in watchlist.items
            if item["id"] == watchlist_item.id and item["media_type"] == watchlist_item.media_type
        ),
        None,
    )

    if not matching_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No matches found for Watchlist Item.",
        )

    matching_item["tags"] = watchlist_item.tags
    flag_modified(watchlist, "items")
    db.add(watchlist)
    db.commit()
    return matching_item


@router.delete("/{watchlist_id}/{media_type}/{item_id}")
async def remove_from_watchlist(
    watchlist_id: int,
    item_id: int,
    media_type: str,
    db: db_dependency,
    watchlist: watchlist_dependency,
):
    item_to_remove = next(
        (
            item
            for item in watchlist.items
            if item["id"] == item_id and item["media_type"] == media_type
        ),
        None,
    )

    if item_to_remove is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item is not in watchlist",
        )

    watchlist.items.remove(item_to_remove)
    flag_modified(watchlist, "items")
    db.add(watchlist)
    db.commit()
    return {
        "message": f"Item: {item_id} was successfully removed from watchlist: {watchlist_id}."
    }


@router.get("/{watchlist_id}/cover_image")
async def watchlist_cover_image(watchlist: watchlist_dependency):
    from PIL import Image
    from io import BytesIO
    from config import settings
    import aiohttp

    watchlist_item_details = []
    for item in watchlist.items[:4]:
        if item["media_type"] == "movie":
            watchlist_item_details.append(
                f"{settings.BASE_URL}/movie/{item['id']}"
            )
        elif item["media_type"] == "tv":
            watchlist_item_details.append(
                f"{settings.BASE_URL}/tv/{item['id']}"
            )

    async with aiohttp.ClientSession() as session:
        poster_paths = []
        for url in watchlist_item_details:
            async with session.get(url, headers={"Authorization": f"Bearer {settings.API_KEY}"}) as response:
                data = await response.json()
                poster_path = data.get("poster_path")
                if poster_path:
                    poster_paths.append(f"{settings.BASE_IMG_URL}/w154{poster_path}")
                else:
                    poster_paths.append(
                        "https://placehold.co/400x600?text=Poster+Unavailable"
                    )

        images = []
        for image_url in poster_paths:
            async with session.get(image_url) as response:
                if response.status == 200:
                    img_data = await response.read()
                    img = Image.open(BytesIO(img_data))
                    images.append(
                        img.resize((200, 300), Image.Resampling.LANCZOS)
                    )

        grid_size = (400, 600)
        grid = Image.new("RGB", grid_size)
        positions = [(0, 0), (200, 0), (0, 300), (200, 300)]

        for pos, img in zip(positions, images):
            grid.paste(img, pos)

        img_bytes = BytesIO()
        grid.save(
            img_bytes,
            format="WEBP",
            quality=60,
            optimize=True,
        )
        img_bytes.seek(0)

        return StreamingResponse(img_bytes, media_type="image/webp")
