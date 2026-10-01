from datetime import datetime, timezone

from fastapi import APIRouter
from app.config.settings import get_settings
from pydantic import BaseModel

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime
    llmConfigured: bool


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="UP",
        service="ai-service",
        timestamp=datetime.now(timezone.utc),
        llmConfigured=bool(settings.llm_api_key and settings.llm_api_key.get_secret_value().strip()),
    )