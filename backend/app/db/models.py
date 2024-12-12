# Models for Database Tables
from sqlalchemy import ARRAY, Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, validates
from sqlalchemy.dialects.postgresql import JSONB


# Declarative Base
class Base(DeclarativeBase):
    pass


metadata = Base.metadata


# Create Tables
# Users Table
class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement="auto")
    username: Mapped[str] = mapped_column(String, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)


# Watchlist Table
class Watchlists(Base):
    __tablename__ = "watchlists"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    items: Mapped[list[dict]] = mapped_column(JSONB, nullable=False, server_default="jsonb '[]'")
    is_private: Mapped[bool] = mapped_column(Boolean, default=False)
    statuses: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        nullable=False,
        server_default="{'completed', 'queued', 'on-hold', 'dropped', 'watching'}"
    )
    all_tags: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, server_default="{}")

    @validates("items")
    def validate_items(self, key, value):
        """Validate the structure of the items array."""
        if not isinstance(value, list):
            raise ValueError(f"'items' must be a list of dictionaries, got {type(value)}.")

        for item in value:
            if not isinstance(item, dict):
                raise ValueError("Each item in 'items' must be a dictionary.")

            # Validate required fields
            if "media_type" not in item or item["media_type"] not in ("movie", "tv"):
                raise ValueError("Each item must have a 'media_type' of 'movie' or 'tv'.")
            if "id" not in item or not isinstance(item["id"], int):
                raise ValueError("Each item must have an integer 'id'.")

            # Set defaults for optional fields
            item.setdefault("status", None)
            if not (item["status"] is None or isinstance(item["status"], str)):
                raise ValueError("'status' must be a string or None.")

            item.setdefault("tags", [])
            if not isinstance(item["tags"], list) or not all(isinstance(tag, str) for tag in item["tags"]):
                raise ValueError("'tags' must be a list of strings.")

        return value
