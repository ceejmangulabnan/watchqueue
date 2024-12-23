# Models for Database Tables
from sqlalchemy import ARRAY, Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB
from typing import List
from typing_extensions import TypedDict


# Declarative Base
class Base(DeclarativeBase):
    pass

# Create Tables
# Users Table
class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement="auto")
    username: Mapped[str] = mapped_column(String, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)

# WatchlistItem
class WatchlistItem(TypedDict):
    media_type: str
    id: int
    status: str
    tags: List[str] 

# Watchlist Table
class Watchlists(Base):
    __tablename__ = "watchlists"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    items: Mapped[list[WatchlistItem]] = mapped_column(JSONB, nullable=False, server_default="jsonb '[]'")
    is_private: Mapped[bool] = mapped_column(Boolean, default=False)
    statuses: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        nullable=False,
        server_default="{completed,queued,on-hold,dropped,watching}"
    )
    all_tags: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, server_default="{}")
