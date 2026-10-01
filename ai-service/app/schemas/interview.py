from enum import StrEnum
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class InterviewRole(StrEnum):
    JAVA_DEVELOPER = "JAVA_DEVELOPER"
    SDE = "SDE"
    FULL_STACK_DEVELOPER = "FULL_STACK_DEVELOPER"


class ExperienceLevel(StrEnum):
    FRESHER = "FRESHER"
    ZERO_TO_ONE_YEAR = "ZERO_TO_ONE_YEAR"
    ONE_TO_THREE_YEARS = "ONE_TO_THREE_YEARS"


class Difficulty(StrEnum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class InterviewQuestionType(StrEnum):
    TECHNICAL = "TECHNICAL"
    DSA = "DSA"
    FOLLOW_UP = "FOLLOW_UP"
    SYSTEM_DESIGN = "SYSTEM_DESIGN"


Score = Annotated[float, Field(ge=0, le=10)]


class QuestionGenerationRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    role: InterviewRole
    experience: ExperienceLevel
    difficulty: Difficulty
    topic: str = Field(min_length=1, max_length=100)
    previous_questions: list[str] = Field(default_factory=list, alias="previousQuestions", max_length=30)
    weak_topics: list[str] = Field(default_factory=list, alias="weakTopics", max_length=30)
    question_number: int = Field(ge=1, le=15, alias="questionNumber")


class GeneratedQuestion(BaseModel):
    question: str = Field(min_length=20, max_length=2000)
    topic: str = Field(min_length=1, max_length=100)
    difficulty: Difficulty
    question_type: InterviewQuestionType = Field(alias="questionType")
    expected_concepts: list[str] = Field(min_length=1, max_length=12, alias="expectedConcepts")


class AnswerEvaluationRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    question: str = Field(min_length=1, max_length=4000)
    answer: str = Field(min_length=1, max_length=20000)
    role: InterviewRole
    topic: str = Field(min_length=1, max_length=100)
    difficulty: Difficulty
    question_type: InterviewQuestionType = Field(
        default=InterviewQuestionType.TECHNICAL, alias="questionType"
    )


class AnswerEvaluation(BaseModel):
    technical_correctness: Score = Field(alias="technicalCorrectness")
    communication: Score
    problem_solving: Score = Field(alias="problemSolving")
    completeness: Score
    code_quality: Score = Field(alias="codeQuality")
    complexity_analysis: Score = Field(alias="complexityAnalysis")
    overall_score: Score = Field(alias="overallScore")
    strengths: list[str] = Field(max_length=8)
    weaknesses: list[str] = Field(max_length=8)
    missing_concepts: list[str] = Field(max_length=8, alias="missingConcepts")
    feedback: str = Field(min_length=1, max_length=2000)
    follow_up_question: str | None = Field(default=None, max_length=1000, alias="followUpQuestion")
    recommended_topic: str = Field(min_length=1, max_length=100, alias="recommendedTopic")