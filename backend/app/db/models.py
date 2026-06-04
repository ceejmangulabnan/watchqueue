from __future__ import annotations
# Models for Database Tables
from datetime import datetime, timezone
from typing import TypedDict, Optional
from sqlalchemy import ARRAY, Boolean, DateTime, ForeignKey, Integer, String, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB


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
    token_version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

# Refresh Tokens Table for rotation and multi-device sessions
class RefreshTokens(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement="auto")
    jti: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    revoked_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=False, 
        default=lambda: datetime.now(timezone.utc)
    )

# Watchlist Item stored as JSONB dict
class WatchlistItemData(TypedDict):
    media_type: str
    id: int
    status: str
    tags: list[str]


# Watchlist Table
class Watchlists(Base):
    __tablename__ = "watchlists"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement="auto")
    title: Mapped[str] = mapped_column(String, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    items: Mapped[list[WatchlistItemData]] = mapped_column(JSONB, nullable=False, server_default=text("'[]'::jsonb"))
    is_private: Mapped[bool] = mapped_column(Boolean, default=False, server_default=text("false"))
    statuses: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        nullable=False,
        server_default="{completed,queued,on-hold,dropped,watching}"
    )
    all_tags: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, server_default="{}")
