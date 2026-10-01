from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.interviews import router as interviews_router

app = FastAPI(
    title="AI Interview Simulator Service",
    version="0.1.0",
    description="AI service boundary for interview generation and evaluation.",
)

app.include_router(health_router)
app.include_router(interviews_router)