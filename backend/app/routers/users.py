from fastapi import APIRouter
from pydantic import BaseModel
from db import models
from db.database import db_dependency

router = APIRouter(prefix="/users")


@router.get("/")
async def hello_users():
    return "Hello Users"


class CreateUser(BaseModel):
    registerUsername: str
    registerPassword: str
    registerConfirmPassword: str
    registerEmail: str


# Register a new user
@router.post("/register")
async def register_user(request_body: CreateUser, db: db_dependency):
    print(request_body)
    try:
        db_user = models.Users(
            username=request_body.registerUsername,
            password=request_body.registerPassword,
            email=request_body.registerEmail,
        )

        db.add(db_user)
        db.commit()
        return 200

    except Exception as e:
        raise e
