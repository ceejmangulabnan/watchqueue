from typing import Optional
from pydantic import BaseModel

class CreateUser(BaseModel):
    username: str
    password: str
    confirmPassword: str
    email: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: str      # username
    id: int       # user_id
    version: int
    jti: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str
