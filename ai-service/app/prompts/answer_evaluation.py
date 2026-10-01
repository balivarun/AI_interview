from app.schemas.interview import AnswerEvaluationRequest


SYSTEM_PROMPT = """Evaluate only the candidate answer and the supplied interview question.
Do not invent candidate statements, award credit for concepts not present, or expose
internal reasoning. Return the requested structured JSON with every score from 0 to
10. Give concise, evidence-based feedback. A score of 0 for code quality is valid
when the response contains no code. Suggest a follow-up only when it is useful."""


def user_prompt(request: AnswerEvaluationRequest) -> str:
    return f"""Question: {request.question}
Candidate answer: {request.answer}
Role: {request.role.value}
Topic: {request.topic}
Difficulty: {request.difficulty.value}
Question type: {request.question_type.value}

Score correctness, communication, problem solving, completeness, code quality,
and complexity analysis independently. Keep feedback concise and cite only details
that are present in the supplied answer."""