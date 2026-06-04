import uuid
from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, Response, Request, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select

from db.models import Users
from db.database import db_dependency
from config import settings
from schemas.user import CreateUser, Token, TokenPayload
from services.auth import (
    validate_new_user_credentials,
    authenticate_user_login,
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    get_user_by_id,
    get_password_hash,
    store_refresh_token,
    get_refresh_token_by_jti,
    revoke_refresh_token,
    revoke_all_user_tokens,
)
from dependencies import user_dependency
import logging

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/users")


def _set_refresh_cookie(response: Response, token: str) -> None:
    kwargs = {
        "key": "refresh_token",
        "value": token,
        "httponly": True,
        "max_age": settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,
    }
    if settings.APP_ENV != "local":
        kwargs.update({"secure": True, "samesite": "none"})
    response.set_cookie(**kwargs)


def _clear_refresh_cookie(response: Response) -> None:
    kwargs = {"key": "refresh_token", "value": "", "max_age": 0}
    if settings.APP_ENV != "local":
        kwargs.update({"secure": True, "samesite": "none"})
    response.set_cookie(**kwargs)

@router.get("/")
async def hello_users():
    return f"Hello {settings.APP_ENV}"


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
    user = authenticate_user_login(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user",
        )

    # Generate session-specific JTI
    jti = str(uuid.uuid4())

    access_token = create_access_token(
        user.username, user.id, user.token_version,
        expires_delta=None,
    )
    refresh_token = create_refresh_token(
        user.username, user.id, user.token_version, jti,
        expires_delta=None,
    )

    # Store refresh token in DB
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    store_refresh_token(db, jti, user.id, expires_at)

    _set_refresh_cookie(response, refresh_token)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/refresh", response_model=Token)
async def refresh_access_token(request: Request, response: Response, db: db_dependency):
    try:
        refresh_token = request.cookies.get("refresh_token")
        if refresh_token is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token not found",
            )

        payload_dict = decode_refresh_token(refresh_token)
        if payload_dict is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        try:
            payload = TokenPayload(**payload_dict)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        if payload.jti is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        now = datetime.now(timezone.utc)

        db_token = get_refresh_token_by_jti(db, payload.jti)

        if db_token and db_token.revoked:
            leeway = timedelta(seconds=10)
            revoked_at = db_token.revoked_at.replace(tzinfo=timezone.utc) if db_token.revoked_at else None

            if revoked_at and (now - revoked_at) > leeway:
                revoke_all_user_tokens(db, payload.id)
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token reuse detected",
                )

        if not db_token or db_token.expires_at.replace(tzinfo=timezone.utc) < now:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired or not found",
            )

        user = get_user_by_id(payload.id, db)
        if not user or user.token_version != payload.version:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session invalidated",
            )

        # Always rotate: revoke old JTI, issue new refresh token
        revoke_refresh_token(db, payload.jti)
        new_jti = str(uuid.uuid4())
        new_refresh_token = create_refresh_token(
            user.username, user.id, user.token_version, new_jti,
        )
        store_refresh_token(db, new_jti, user.id, now + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES))

        new_access_token = create_access_token(
            user.username, user.id, user.token_version,
        )

        _set_refresh_cookie(response, new_refresh_token)
        return {"access_token": new_access_token, "token_type": "bearer"}

    except HTTPException:
        _clear_refresh_cookie(response)
        raise
    except Exception as e:
        logger.error(f"Users Router: Unexpected error during token refresh: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@router.get("/me")
async def get_me(user: user_dependency):
    return user


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(request: Request, response: Response, db: db_dependency):
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token:
        payload_dict = decode_refresh_token(refresh_token)
        if payload_dict:
            try:
                payload = TokenPayload(**payload_dict)
                if payload.jti:
                    # Only revoke this specific session
                    revoke_refresh_token(db, payload.jti)
            except Exception:
                pass

    _clear_refresh_cookie(response)
    return {"message": "Logged out successfully"}

