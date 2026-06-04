from pydantic import BaseModel

class CreateWatchlist(BaseModel):
    title: str


class WatchlistItem(BaseModel):
    media_type: str
    id: int
    status: str = ""
    tags: list[str] = []


class UpdateItemStatus(BaseModel):
    media_type: str
    id: int
    status: str


class UpdateItemTags(BaseModel):
    media_type: str
    id: int
    tags: list[str]
