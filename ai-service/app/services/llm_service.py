import logging
from typing import TypeVar

from openai import OpenAIError, AsyncOpenAI
from pydantic import BaseModel

from app.config.settings import Settings
from app.prompts import answer_evaluation, question_generation
from app.schemas.interview import (
    AnswerEvaluation,
    AnswerEvaluationRequest,
    GeneratedQuestion,
    QuestionGenerationRequest,
)

logger = logging.getLogger(__name__)
OutputModel = TypeVar("OutputModel", bound=BaseModel)


class LLMNotConfiguredError(Exception):
    pass


class LLMProviderError(Exception):
    pass


class LLMService:
    def __init__(self, settings: Settings):
        if settings.llm_api_key is None or not settings.llm_api_key.get_secret_value().strip():
            raise LLMNotConfiguredError("LLM_API_KEY is not configured")

        self._model = settings.llm_model
        self._client = AsyncOpenAI(
            api_key=settings.llm_api_key.get_secret_value(),
            base_url=settings.llm_base_url,
            timeout=30.0,
            max_retries=1,
        )

    async def close(self) -> None:
        await self._client.close()

    async def generate_question(self, request: QuestionGenerationRequest) -> GeneratedQuestion:
        return await self._complete(
            output_model=GeneratedQuestion,
            system_prompt=question_generation.SYSTEM_PROMPT,
            user_prompt=question_generation.user_prompt(request),
        )

    async def evaluate_answer(self, request: AnswerEvaluationRequest) -> AnswerEvaluation:
        return await self._complete(
            output_model=AnswerEvaluation,
            system_prompt=answer_evaluation.SYSTEM_PROMPT,
            user_prompt=answer_evaluation.user_prompt(request),
        )

    async def _complete(
        self,
        output_model: type[OutputModel],
        system_prompt: str,
        user_prompt: str,
    ) -> OutputModel:
        try:
            completion = await self._client.beta.chat.completions.parse(
                model=self._model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                response_format=output_model,
            )
            result = completion.choices[0].message
            if result.refusal:
                raise LLMProviderError("The model refused the request")
            if result.parsed is None:
                raise LLMProviderError("The model returned no structured response")
            return result.parsed
        except LLMProviderError:
            raise
        except OpenAIError as error:
            logger.warning("LLM provider request failed: %s", type(error).__name__)
            raise LLMProviderError("The LLM provider request failed") from error