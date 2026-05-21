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


class LoginRequest(BaseModel):
    username: str
    password: str
