from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, Response, Request, status, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from db.models import Users
from db.database import db_dependency
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import jwt, JWTError
import os
import re
from sqlalchemy import select

# Import env variables
load_dotenv()
ACCESS_JWT_SECRET = str(os.getenv("ACCESS_JWT_SECRET"))
REFRESH_JWT_SECRET = str(os.getenv("REFRESH_JWT_SECRET"))
JWT_ALGORITHM = str(os.getenv("JWT_ALGORITHM"))

ACCESS_TOKEN_EXPIRE_MINUTES = 15
# 7 days
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7


router = APIRouter(prefix="/users")

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token")


@router.get("/")
async def hello_users():
    return "Hello Users"


class CreateUser(BaseModel):
    registerUsername: str
    registerPassword: str
    registerConfirmPassword: str
    registerEmail: str


class Token(BaseModel):
    access_token: str
    token_type: str


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(create_user_request: CreateUser, db: db_dependency):
    """
    Adds new user to the database
    """

    new_user_is_valid = validate_new_user_credentials(create_user_request)
    duplicate_username_query = select(Users).where(
        Users.username == create_user_request.registerUsername
    )
    result = db.execute(duplicate_username_query)
    duplicate_username = result.scalar()

    if duplicate_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Username is not available"
        )

    if new_user_is_valid:
        new_user = Users(
            username=create_user_request.registerUsername,
            password=get_password_hash(create_user_request.registerPassword),
            email=create_user_request.registerEmail,
        )

        db.add(new_user)
        db.commit()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Credentials did not match expected format",
        )


def validate_new_user_credentials(credentials: CreateUser):
    """
    Uses RegEx to validate if the new user credentials passed adhere to set RegEx patterns
    """
    # Min 4 chars alphanumeric
    username_pattern = re.compile("^[a-zA-Z0-9]{4,}$")
    username_valid = username_pattern.fullmatch(credentials.registerUsername)

    # Min 8 Chars, 1 uppercase, 1 lowercase, 1 symbol, and 1 number
    password_pattern = re.compile(
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$"
    )
    password_valid = password_pattern.fullmatch(credentials.registerPassword)

    # email pattern is x@x.x where x is any char
    email_pattern = re.compile("[^\\s@]+@[^\\s@]+\\.[^\\s@]+")
    email_valid = email_pattern.fullmatch(credentials.registerEmail)

    if credentials.registerPassword != credentials.registerConfirmPassword:
        return False

    if username_valid is None or password_valid is None or email_valid is None:
        return False

    return True


def get_password_hash(password):
    return bcrypt_context.hash(password)


def verify_password(password, hashed_password):
    return bcrypt_context.verify(password, hashed_password)


def authenticate_user(username: str, password: str, db: db_dependency):
    user_query = select(Users).where(Users.username == username)
    result = db.execute(user_query)
    user = result.scalar()

    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


# Create token for user on login
@router.post("/token", response_model=Token, status_code=status.HTTP_200_OK)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: db_dependency,
    response: Response,
):
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user"
        )

    access_token = create_access_token(
        user.username, user.id, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    refresh_token = create_refresh_token(
        user.username, user.id, timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        # max_age is in seconds so multiply by 60
        max_age=REFRESH_TOKEN_EXPIRE_MINUTES * 60,
    )

    return {"access_token": access_token, "token_type": "bearer"}


def create_refresh_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {"sub": username, "id": user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, REFRESH_JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {"sub": username, "id": user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, ACCESS_JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_access_token_cookie(request: Request):
    access_token = request.cookies.get("access_token")
    if access_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Access token not found"
        )
    return access_token


token = Annotated[str, Depends(oauth2_scheme)]


# Dependency for routes that need an authenticated user to access
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, ACCESS_JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username = payload.get("sub")
        user_id = payload.get("id")
        if username is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate user",
            )
        return {"username": username, "id": user_id}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Token Expired",
        )


@router.get("/refresh", response_model=Token)
async def get_refresh_from_cookie(request: Request):
    """
    Generates new access token if refresh token from HTTPonly cookie is not expired
    """

    refresh_token = request.cookies.get("refresh_token")

    if refresh_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh Token not found"
        )

    try:
        payload = jwt.decode(
            refresh_token, REFRESH_JWT_SECRET, algorithms=[JWT_ALGORITHM]
        )
        username = payload.get("sub")
        user_id = payload.get("id")

        if username is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    new_access_token = create_access_token(
        username=username,
        user_id=user_id,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {"access_token": new_access_token, "token_type": "bearer"}


user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/me")
async def get_me(user: user_dependency):
    if user:
        return user


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(request: Request, response: Response):
    """
    Sets token value to empty string on logout
    """
    refresh_token = request.cookies.get("refresh_token")

    if refresh_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    # TODO: Set secure=True on deployment
    response.set_cookie(key="refresh_token", value="", max_age=0, httponly=True)

    return {"message": "Logged out successfully"}
