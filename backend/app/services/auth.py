from datetime import timedelta, datetime, timezone
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy import select
import re
import os
import logging

from db.models import Users
from db.database import db_dependency
from config import settings
from schemas.user import CreateUser

logger = logging.getLogger(__name__)

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def validate_new_user_credentials(credentials: CreateUser) -> bool:
    username_pattern = re.compile("^[a-zA-Z0-9]{4,}$")
    username_valid = username_pattern.fullmatch(credentials.username)

    password_pattern = re.compile(
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$"
    )
    password_valid = password_pattern.fullmatch(credentials.password)

    email_pattern = re.compile(r"[^\s@]+@[^\s@]+\.[^\s@]+")
    email_valid = email_pattern.fullmatch(credentials.email)

    if credentials.password != credentials.confirmPassword:
        return False

    return username_valid is not None and password_valid is not None and email_valid is not None


def get_password_hash(password: str) -> str:
    return bcrypt_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt_context.verify(password, hashed_password)


def authenticate_user(username: str, password: str, db: db_dependency) -> Optional[Users]:
    user_query = select(Users).where(Users.username == username)
    result = db.execute(user_query)
    user = result.scalar()

    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user


def create_access_token(username: str, user_id: int, token_version: int, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    encode = {"sub": username, "id": user_id, "version": token_version}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, settings.ACCESS_JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(username: str, user_id: int, token_version: int, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    
    encode = {"sub": username, "id": user_id, "version": token_version}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, settings.REFRESH_JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_refresh_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.REFRESH_JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        logger.error("Failed to decode refresh token")
        return None


def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.ACCESS_JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        logger.error("Failed to decode access token")
        return None


def get_user_by_id(user_id: int, db: db_dependency) -> Optional[Users]:
    user_query = select(Users).where(Users.id == user_id)
    result = db.execute(user_query)
    return result.scalar()


def create_user(username: str, password: str, email: str, db: db_dependency) -> Users:
    user = Users(
        username=username,
        password=get_password_hash(password),
        email=email,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def invalidate_user_tokens(user_id: int, db: db_dependency) -> None:
    user = get_user_by_id(user_id, db)
    if user:
        user.token_version += 1
        db.commit()