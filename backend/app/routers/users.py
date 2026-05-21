from typing import Annotated
from fastapi import APIRouter, Depends, Response, Request, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select

from db.models import Users
from db.database import db_dependency
from config import settings
from schemas.user import CreateUser, Token
from services.auth import (
    validate_new_user_credentials,
    authenticate_user,
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    get_user_by_id,
    invalidate_user_tokens,
    get_password_hash,
)
from dependencies import user_dependency

router = APIRouter(prefix="/users")

@router.get("/")
async def hello_users():
    return f"Hello {settings.PROD}"


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(create_user_request: CreateUser, db: db_dependency):
    duplicate_username_query = select(Users).where(
        Users.username == create_user_request.username
    )
    result = db.execute(duplicate_username_query)
    duplicate_username = result.scalar()

    if duplicate_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username is not available",
        )

    if not validate_new_user_credentials(create_user_request):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Credentials did not match expected format",
        )

    user = Users(
        username=create_user_request.username,
        password=get_password_hash(create_user_request.password),
        email=create_user_request.email,
    )
    db.add(user)
    db.commit()
    return {"message": "User created successfully"}


@router.post("/token", response_model=Token, status_code=status.HTTP_200_OK)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: db_dependency,
    response: Response,
):
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user",
        )

    access_token = create_access_token(
        user.username, user.id, user.token_version,
        expires_delta=None,
    )
    refresh_token = create_refresh_token(
        user.username, user.id, user.token_version,
        expires_delta=None,
    )

    cookie_kwargs = {
        "key": "refresh_token",
        "value": refresh_token,
        "httponly": True,
        "max_age": settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,
    }
    if settings.PROD:
        cookie_kwargs.update({"secure": True, "samesite": "none"})

    response.set_cookie(**cookie_kwargs)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/refresh", response_model=Token)
async def refresh_access_token(request: Request, response: Response, db: db_dependency):
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found",
        )

    payload = decode_refresh_token(refresh_token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    username = payload.get("sub")
    user_id = payload.get("id")
    token_version = payload.get("version")

    if username is None or user_id is None or token_version is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    user = get_user_by_id(user_id, db)
    if not user or user.token_version != token_version:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalidated",
        )

    new_access_token = create_access_token(
        user.username, user.id, user.token_version,
    )
    new_refresh_token = create_refresh_token(
        user.username, user.id, user.token_version,
    )

    cookie_kwargs = {
        "key": "refresh_token",
        "value": new_refresh_token,
        "httponly": True,
        "max_age": settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,
    }
    if settings.PROD:
        cookie_kwargs.update({"secure": True, "samesite": "none"})

    response.set_cookie(**cookie_kwargs)
    return {"access_token": new_access_token, "token_type": "bearer"}


@router.get("/me")
async def get_me(user: user_dependency):
    return user


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(request: Request, response: Response, db: db_dependency):
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    payload = decode_refresh_token(refresh_token)
    if payload is not None:
        user_id = payload.get("id")
        if user_id:
            invalidate_user_tokens(user_id, db)

    cookie_kwargs = {"key": "refresh_token", "value": "", "max_age": 0}
    if settings.PROD:
        cookie_kwargs.update({"secure": True, "samesite": "none"})

    response.set_cookie(**cookie_kwargs)
    return {"message": "Logged out successfully"}
