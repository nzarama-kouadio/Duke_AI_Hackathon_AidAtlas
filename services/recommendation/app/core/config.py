from functools import lru_cache
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    """Runtime configuration for the recommendation service."""

    model_config = SettingsConfigDict(env_file=".env", env_prefix="AIDATLAS_", case_sensitive=False)

    env: str = "development"
    host: str = "0.0.0.0"
    port: int = 8081
    redis_url: str = "redis://localhost:6379/0"
    model_registry_path: str = "./models"


class RecommendationWeights(BaseModel):
    content_weight: float = 0.5
    collaborative_weight: float = 0.4
    exploration_weight: float = 0.1


class Settings(BaseModel):
    app: AppSettings
    weights: RecommendationWeights = RecommendationWeights()


@lru_cache
def get_settings() -> Settings:
    """Load settings once per process."""

    app_settings = AppSettings()
    return Settings(app=app_settings)
