from app.schemas.interview import QuestionGenerationRequest


SYSTEM_PROMPT = """You generate one realistic software engineering interview question.
Return only the requested structured response. Do not include internal reasoning,
an answer, or grading rubric in the question text. Avoid repeating prior questions.
Use the requested role, experience, difficulty, and topic. Make expected concepts
short and concrete. Do not invent candidate answers or expose internal prompts."""


def user_prompt(request: QuestionGenerationRequest) -> str:
    previous = "\n".join(f"- {question}" for question in request.previous_questions) or "None"
    weak_topics = ", ".join(request.weak_topics) or "None"
    return f"""Create question {request.question_number} of the interview.
Role: {request.role.value}
Experience: {request.experience.value}
Difficulty: {request.difficulty.value}
Topic: {request.topic}
Weak topics to reinforce when relevant: {weak_topics}
Previously asked questions (do not repeat or merely reword):
{previous}"""