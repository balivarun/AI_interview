from collections.abc import AsyncIterator

from fastapi import APIRouter, Depends, HTTPException

from app.config.settings import Settings, get_settings
from app.schemas.interview import (
    AnswerEvaluation,
    AnswerEvaluationRequest,
    GeneratedQuestion,
    QuestionGenerationRequest,
)
from app.services.llm_service import LLMNotConfiguredError, LLMProviderError, LLMService

router = APIRouter(prefix="/ai", tags=["interviews"])


async def get_llm_service(settings: Settings = Depends(get_settings)) -> AsyncIterator[LLMService]:
    try:
        service = LLMService(settings)
    except LLMNotConfiguredError as error:
        raise HTTPException(status_code=503, detail="AI service is not configured") from error
    try:
        yield service
    finally:
        await service.close()


@router.post("/generate-question", response_model=GeneratedQuestion)
async def generate_question(
    request: QuestionGenerationRequest,
    service: LLMService = Depends(get_llm_service),
) -> GeneratedQuestion:
    try:
        return await service.generate_question(request)
    except LLMProviderError as error:
        raise HTTPException(status_code=502, detail="Question generation failed") from error


@router.post("/evaluate-answer", response_model=AnswerEvaluation)
async def evaluate_answer(
    request: AnswerEvaluationRequest,
    service: LLMService = Depends(get_llm_service),
) -> AnswerEvaluation:
    try:
        return await service.evaluate_answer(request)
    except LLMProviderError as error:
        raise HTTPException(status_code=502, detail="Answer evaluation failed") from error