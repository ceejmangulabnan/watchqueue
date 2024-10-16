from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import delete, select
from starlette.status import (
    HTTP_404_NOT_FOUND,
)
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
            raise e


@router.get("/{watchlist_id}")
async def get_watchlist(user: user_dependency, db: db_dependency, watchlist_id: int):
    if user:
        try:
            watchlist_query = select(Watchlists).where(
                Watchlists.id == watchlist_id, Watchlists.user_id == user.get("id")
            )
            result = db.execute(watchlist_query)
            watchlist = result.scalar()

            if watchlist is None:
                raise HTTPException(status_code=HTTP_404_NOT_FOUND)
            else:
                return watchlist

        except Exception as e:
            raise e


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
                    status_code=HTTP_404_NOT_FOUND, detail="Watchlist does not exist"
                )

            db.commit()
            return {"message": f"Watchlist {watchlist_id} was deleted successfully"}
        except Exception as e:
            db.rollback()
            raise e


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
                    Watchlists.user_id == user_id, Watchlists.is_private == False
                )

                results = db.execute(user_watchlists_query).all()

                user_watchlists = []
                for result in results:
                    user_watchlists.append(result[0])

                return user_watchlists

        except Exception as e:
            raise e


class AddToWatchlist(BaseModel):
    movie_id: int


@router.post("/{watchlist_id}/add")
async def add_to_watchlist(
    user: user_dependency, db: db_dependency, watchlist_id: int, request: AddToWatchlist
):
    try:
        if user:
            watchlist_query = select(Watchlists).where(
                Watchlists.id == watchlist_id, Watchlists.user_id == user.get("id")
            )
            result = db.execute(watchlist_query)
            watchlist = result.scalar()

            if watchlist is None:
                raise HTTPException(
                    status_code=HTTP_404_NOT_FOUND, detail="Watchlist not found"
                )
            else:
                watchlist.items = watchlist.items + [request.movie_id]
                db.add(watchlist)
                db.commit()

    except Exception as e:
        db.rollback()
        return e
