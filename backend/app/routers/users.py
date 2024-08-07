from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from db.models import Users
from db.database import db_dependency
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import jwt, JWTError
import os

# Import env variables
load_dotenv()
JWT_SECRET = str(os.getenv("JWT_SECRET"))
JWT_ALGORITHM = str(os.getenv("JWT_ALGORITHM"))

router = APIRouter(prefix="/users")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token")

# For hashing and verifying passwords
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/")
async def hello_users():
    return "Hello Users"


# Request Body Model for user registration
class CreateUser(BaseModel):
    registerUsername: str
    registerPassword: str
    registerConfirmPassword: str
    registerEmail: str


class Token(BaseModel):
    access_token: str
    token_type: str


# Register a new user
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(create_user_request: CreateUser, db: db_dependency):
    new_user = Users(
        username=create_user_request.registerUsername,
        password=get_password_hash(create_user_request.registerPassword),
        email=create_user_request.registerEmail,
    )

    db.add(new_user)
    db.commit()


def get_password_hash(password):
    return bcrypt_context.hash(password)


def verify_password(password, hashed_password):
    return bcrypt_context.verify(password, hashed_password)


# Checks if user exists and passwords match
def authenticate_user(username: str, password: str, db: db_dependency):
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


# Create token for user on login
@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user"
        )
    token = create_access_token(user.username, user.id, timedelta(minutes=20))

    return {"access_token": token, "token_type": "bearer"}


def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {"sub": username, "id": user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


# Can be passed as a dependency on routes that need to check if a user is logged in
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
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
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user"
        )
