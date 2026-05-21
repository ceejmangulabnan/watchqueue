from typing import Annotated
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select

from db.models import Users
from db.database import db_dependency
from services.auth import decode_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token")


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: db_dependency):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Token Expired",
        )
    
    username = payload.get("sub")
    user_id = payload.get("id")
    token_version = payload.get("version")
    
    if username is None or user_id is None or token_version is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    
    user_query = select(Users).where(Users.id == user_id)
    result = db.execute(user_query)
    user = result.scalar()
    
    if not user or user.token_version != token_version:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalidated",
        )
    
    return {"username": username, "id": user_id}


user_dependency = Annotated[dict, Depends(get_current_user)]