from functools import lru_cache

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(extra="ignore")

    llm_api_key: SecretStr | None = None
    llm_model: str = "gpt-4o-mini"
    llm_base_url: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()