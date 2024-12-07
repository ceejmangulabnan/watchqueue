from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import delete, select
from sqlalchemy.orm.attributes import flag_modified
from starlette import status
from db.models import Watchlists
from routers.users import user_dependency
from db.database import db_dependency


router = APIRouter(prefix="/watchlists")


@router.get("/")
async def watchlists():
    return {"message": "watchlists"}


class CreateWatchlist(BaseModel):
    title: str


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


async def get_watchlist_from_db(user: user_dependency, db: db_dependency, watchlist_id: int):
    watchlist_query = select(Watchlists).where(
            Watchlists.id == watchlist_id, Watchlists.user_id == user.get("id")
        )
    result = db.execute(watchlist_query)
    watchlist = result.scalar()
    return watchlist


@router.get("/{watchlist_id}")
async def get_watchlist(user: user_dependency, db: db_dependency, watchlist_id: int):
    if user:
        try:
            watchlist = await get_watchlist_from_db(user, db, watchlist_id)

            if watchlist is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
            else:
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


class AddToWatchlist(BaseModel):
    item_id: int


@router.post("/{watchlist_id}/add")
async def add_to_watchlist(
    user: user_dependency, db: db_dependency, watchlist_id: int, request: AddToWatchlist
):
    if user:
        try:
            watchlist = await get_watchlist_from_db(user, db, watchlist_id)

            if watchlist is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist not found"
                )

            if request.item_id in watchlist.items:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Item already exists in the watchlist",
                )

            watchlist.items = watchlist.items + [request.item_id]
            db.add(watchlist)
            db.commit()
            return {
                "message": f"Watchlist Item {request.item_id} has been added to Watchlist {watchlist_id}"
            }

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))


@router.delete('/{watchlist_id}/{item_id}')
async def remove_from_watchlist(watchlist_id: int, item_id: int, user: user_dependency, db: db_dependency ):
    if user:
        try:
            watchlist = await get_watchlist_from_db(user, db, watchlist_id)

            if watchlist is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist not found"
                )

            if item_id not in watchlist.items:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item is not in watchlist")

            watchlist.items.remove(item_id)
            flag_modified(watchlist, "items")


            db.add(watchlist)
            db.commit()
            return {
                "message": f"Item: {item_id} was successfully removed from watchlist: {watchlist_id}."
            }

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
