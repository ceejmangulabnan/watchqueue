from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    API_KEY: str
    BASE_URL: str
    BASE_IMG_URL: str
    ACCESS_JWT_SECRET: str
    REFRESH_JWT_SECRET: str
    JWT_ALGORITHM: str
    PROD: bool = False
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()