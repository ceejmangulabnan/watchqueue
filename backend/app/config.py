from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal

class Settings(BaseSettings):
    API_KEY: str = None  # type: ignore
    BASE_URL: str = None  # type: ignore
    BASE_IMG_URL: str = None  # type: ignore
    ACCESS_JWT_SECRET: str = None  # type: ignore
    REFRESH_JWT_SECRET: str = None  # type: ignore
    JWT_ALGORITHM: str = None  # type: ignore

    APP_ENV: Literal["local", "staging", "production"] = "local"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7    

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
