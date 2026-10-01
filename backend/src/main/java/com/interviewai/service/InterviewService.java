package com.interviewai.service;

import com.interviewai.dto.request.AnswerRequest;
import com.interviewai.dto.request.InterviewRequest;
import com.interviewai.dto.request.CodeSubmissionRequest;
import com.interviewai.client.AiEvaluationRequest;
import com.interviewai.client.AiEvaluationResponse;
import com.interviewai.client.AiQuestionRequest;
import com.interviewai.client.AiQuestionResponse;
import com.interviewai.client.AiServiceClient;
import com.interviewai.client.AiServiceException;
import com.interviewai.dto.response.AnswerResponse;
import com.interviewai.dto.response.CodeSubmissionResponse;
import com.interviewai.dto.response.InterviewResponse;
import com.interviewai.dto.response.InterviewReportResponse;
import com.interviewai.entity.Answer;
import com.interviewai.entity.AppUser;
import com.interviewai.entity.Evaluation;
import com.interviewai.entity.Difficulty;
import com.interviewai.entity.CodeSubmission;
import com.interviewai.entity.Interview;
import com.interviewai.entity.InterviewRole;
import com.interviewai.entity.InterviewStatus;
import com.interviewai.entity.Question;
import com.interviewai.entity.QuestionType;
import com.interviewai.repository.AnswerRepository;
import com.interviewai.repository.CodeSubmissionRepository;
import com.interviewai.repository.EvaluationRepository;
import com.interviewai.repository.InterviewRepository;
import com.interviewai.repository.QuestionRepository;
import com.interviewai.repository.UserRepository;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class InterviewService {
    private static final Logger logger = LoggerFactory.getLogger(InterviewService.class);
    private static final List<QuestionDraft> QUESTION_BANK = List.of(
            new QuestionDraft("What is the difference between ArrayList and LinkedList?", "Java Collections", QuestionType.TECHNICAL),
            new QuestionDraft("Explain how HashMap handles collisions and resizes its internal table.", "HashMap", QuestionType.TECHNICAL),
            new QuestionDraft("How would you design a thread-safe cache in Java?", "Multithreading", QuestionType.TECHNICAL),
            new QuestionDraft("Given an array and a target, describe an efficient way to find two values that sum to it.", "Arrays", QuestionType.DSA),
            new QuestionDraft("What are the time and space complexity of binary search, and when can it be used?", "Complexity Analysis", QuestionType.DSA),
            new QuestionDraft("How would you diagnose a memory leak in a Java service?", "JVM", QuestionType.TECHNICAL),
            new QuestionDraft("Explain the difference between checked and unchecked exceptions.", "Exception Handling", QuestionType.TECHNICAL),
            new QuestionDraft("Describe a breadth-first traversal of a binary tree.", "Trees", QuestionType.DSA),
            new QuestionDraft("What trade-offs would you consider when designing a REST API?", "System Design", QuestionType.SYSTEM_DESIGN),
            new QuestionDraft("How do you choose an appropriate data structure for a lookup-heavy workload?", "Data Structures", QuestionType.DSA));

    private final InterviewRepository interviewRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final CodeSubmissionRepository codeSubmissionRepository;
    private final CodeExecutionService codeExecutionService;
    private final EvaluationRepository evaluationRepository;
    private final AiServiceClient aiServiceClient;

    public InterviewService(InterviewRepository interviewRepository, QuestionRepository questionRepository,
            AnswerRepository answerRepository, UserRepository userRepository,
            CodeSubmissionRepository codeSubmissionRepository, CodeExecutionService codeExecutionService,
            EvaluationRepository evaluationRepository, AiServiceClient aiServiceClient) {
        this.interviewRepository = interviewRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
        this.codeSubmissionRepository = codeSubmissionRepository;
        this.codeExecutionService = codeExecutionService;
        this.evaluationRepository = evaluationRepository;
        this.aiServiceClient = aiServiceClient;
    }

    @Transactional
    public InterviewResponse create(String clerkId, InterviewRequest request) {
        AppUser user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Interview interview = new Interview();
        interview.setOwner(user);
        interview.setRole(request.role());
        interview.setExperience(request.experience());
        interview.setDifficulty(request.difficulty());
        interview.setInterviewType(request.interviewType());
        interview.setTotalQuestions(request.totalQuestions());
        interview.setDurationMinutes(request.durationMinutes());
        return InterviewMapper.toResponse(interviewRepository.save(interview), List.of());
    }

    public InterviewResponse start(String clerkId, UUID id) {
        Interview interview = ownedInterview(clerkId, id);
        if (interview.getStatus() == InterviewStatus.COMPLETED || interview.getStatus() == InterviewStatus.ABANDONED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Interview cannot be started in its current state");
        }
        if (interview.getStatus() == InterviewStatus.CREATED) {
            AiQuestionResponse generated = generateQuestion(interview, 1, List.of(), List.of());
            questionRepository.save(toQuestion(interview, 1, generated));
            interview.setStatus(InterviewStatus.IN_PROGRESS);
            interview.setStartedAt(Instant.now());
            interview.setCurrentQuestionNumber(1);
            interviewRepository.save(interview);
        }
        return InterviewMapper.toResponse(interview, questionRepository.findAllByInterviewIdOrderByQuestionNumber(id));
    }

    @Transactional(readOnly = true)
    public InterviewResponse get(String clerkId, UUID id) {
        Interview interview = ownedInterview(clerkId, id);
        return InterviewMapper.toResponse(interview, questionRepository.findAllByInterviewIdOrderByQuestionNumber(id));
    }

    @Transactional(readOnly = true)
    public Page<InterviewResponse> list(String clerkId, InterviewRole role, Difficulty difficulty,
            InterviewStatus status, int page, int size) {
        AppUser user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Page<Interview> interviews = interviewRepository.searchOwnerInterviews(user.getId(), role, difficulty, status,
                PageRequest.of(page, size, org.springframework.data.domain.Sort.by("createdAt").descending()));
        return interviews.map(interview -> InterviewMapper.toResponse(interview, List.of()));
    }

    public AnswerResponse submitAnswer(String clerkId, UUID interviewId, AnswerRequest request) {
        Interview interview = ownedInterview(clerkId, interviewId);
        if (interview.getStatus() != InterviewStatus.IN_PROGRESS) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Interview is not in progress");
        }
        Question question = questionRepository.findByIdAndInterviewId(request.questionId(), interviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));
        if (question.getQuestionNumber() != interview.getCurrentQuestionNumber()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This is not the current interview question");
        }
        if (answerRepository.existsByQuestionId(question.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An answer was already submitted for this question");
        }
        Answer answer = new Answer();
        answer.setQuestion(question);
        answer.setInterview(interview);
        answer.setAnswerText(request.answerText().trim());
        answer.setDurationSeconds(request.durationSeconds());
        answer = answerRepository.save(answer);

        AiEvaluationResponse aiEvaluation = evaluateAnswer(interview, question, answer);
        boolean evaluationPending = aiEvaluation == null;
        if (aiEvaluation != null) {
            evaluationRepository.save(toEvaluation(answer, aiEvaluation));
            answer.setOverallScore(aiEvaluation.overallScore());
            answerRepository.save(answer);
        }

        boolean completed = question.getQuestionNumber() >= interview.getTotalQuestions();
        if (completed) {
            interview.setStatus(InterviewStatus.COMPLETED);
            interview.setCompletedAt(Instant.now());
            if (aiEvaluation != null) interview.setOverallScore(aiEvaluation.overallScore());
        } else {
            int nextQuestionNumber = question.getQuestionNumber() + 1;
            List<Question> previous = questionRepository.findAllByInterviewIdOrderByQuestionNumber(interviewId);
            Question nextQuestion;
            if (aiEvaluation != null && aiEvaluation.overallScore() < 5
                    && aiEvaluation.followUpQuestion() != null && !aiEvaluation.followUpQuestion().isBlank()) {
                nextQuestion = new Question();
                nextQuestion.setInterview(interview);
                nextQuestion.setQuestionText(aiEvaluation.followUpQuestion());
                nextQuestion.setTopic(aiEvaluation.recommendedTopic());
                nextQuestion.setDifficulty(interview.getDifficulty());
                nextQuestion.setQuestionType(QuestionType.FOLLOW_UP);
                nextQuestion.setQuestionNumber(nextQuestionNumber);
                nextQuestion.setExpectedConcepts("");
            } else {
                List<String> weakTopics = aiEvaluation != null && aiEvaluation.overallScore() < 7
                        ? List.of(aiEvaluation.recommendedTopic()) : List.of();
                AiQuestionResponse generated = generateQuestion(interview, nextQuestionNumber,
                        previous.stream().map(Question::getQuestionText).toList(), weakTopics);
                nextQuestion = toQuestion(interview, nextQuestionNumber, generated);
            }
            questionRepository.save(nextQuestion);
            interview.setCurrentQuestionNumber(nextQuestionNumber);
        }
        interviewRepository.save(interview);
        return new AnswerResponse(true, completed, interview.getCurrentQuestionNumber(), evaluationPending);
    }

    @Transactional
    public CodeSubmissionResponse submitCode(String clerkId, UUID interviewId, CodeSubmissionRequest request) {
        Interview interview = ownedInterview(clerkId, interviewId);
        if (interview.getStatus() != InterviewStatus.IN_PROGRESS) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Interview is not in progress");
        }
        Question question = questionRepository.findByIdAndInterviewId(request.questionId(), interviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));
        CodeSubmission submission = new CodeSubmission();
        submission.setInterview(interview);
        submission.setQuestion(question);
        submission.setLanguage(request.language());
        submission.setCode(request.code());
        codeSubmissionRepository.save(submission);
        CodeExecutionResult result = codeExecutionService.execute(request.language(), request.code());
        return new CodeSubmissionResponse(true, result.passed(), result.total(), result.status());
    }

    @Transactional(readOnly = true)
    public InterviewReportResponse report(String clerkId, UUID id) {
        Interview interview = ownedInterview(clerkId, id);
        if (interview.getStatus() != InterviewStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Interview is not complete yet");
        }
        List<Answer> answers = answerRepository.findAllByInterviewId(id);
        List<Evaluation> evaluations = evaluationRepository.findAllForInterview(id);
        boolean pending = evaluations.size() < answers.size();
        double score = average(evaluations.stream().map(Evaluation::getOverallScore).toList());
        String completedAt = DateTimeFormatter.ofPattern("MMMM d, uuuu")
                .withZone(ZoneOffset.UTC).format(interview.getCompletedAt());
        List<String> strengths = evaluations.stream().flatMap(evaluation -> evaluation.getStrengths().stream())
            .distinct().limit(8).toList();
        List<String> weaknesses = evaluations.stream()
            .flatMap(evaluation -> java.util.stream.Stream.concat(
                evaluation.getWeaknesses().stream(), evaluation.getMissingConcepts().stream()))
            .distinct().limit(8).toList();
        if (evaluations.isEmpty()) {
            strengths = List.of("Answers saved; AI evaluation is pending.");
            weaknesses = List.of("Evaluation becomes available when the AI service is configured.");
        }
        List<InterviewReportResponse.RecommendedTopic> recommendations = evaluations.stream()
            .map(Evaluation::getRecommendedTopic).filter(Objects::nonNull).distinct().limit(5)
            .map(topic -> new InterviewReportResponse.RecommendedTopic(topic, interview.getDifficulty().name(), "Practice"))
            .toList();
        if (recommendations.isEmpty()) {
            recommendations = List.of(new InterviewReportResponse.RecommendedTopic(
                "Core interview topics", interview.getDifficulty().name(), "Practice"));
        }
        return new InterviewReportResponse(interview.getId(), interview.getRole().name(),
            interview.getDurationMinutes() + " min", completedAt, score,
            average(evaluations.stream().map(Evaluation::getTechnicalCorrectness).toList()),
            average(evaluations.stream().map(Evaluation::getProblemSolving).toList()),
            average(evaluations.stream().map(Evaluation::getCommunication).toList()),
            average(evaluations.stream().map(Evaluation::getCodeQuality).toList()),
            average(evaluations.stream().map(Evaluation::getComplexityAnalysis).toList()),
                strengths, weaknesses, recommendations, pending);
    }

        private AiQuestionResponse generateQuestion(Interview interview, int questionNumber,
            List<String> previousQuestions, List<String> weakTopics) {
        String requestedTopic = weakTopics.stream().findFirst().orElseGet(() -> topicFor(interview, questionNumber));
        AiQuestionRequest request = new AiQuestionRequest(interview.getRole().name(), interview.getExperience().name(),
            interview.getDifficulty().name(), requestedTopic, previousQuestions, weakTopics, questionNumber);
        try {
            return aiServiceClient.generateQuestion(request);
        } catch (AiServiceException exception) {
            logger.warn("AI question generation unavailable for interview {} question {}", interview.getId(), questionNumber);
            QuestionDraft fallback = QUESTION_BANK.get((questionNumber - 1) % QUESTION_BANK.size());
            return new AiQuestionResponse(fallback.text(), fallback.topic(), interview.getDifficulty().name(),
                fallback.type().name(), List.of());
        }
        }

        private AiEvaluationResponse evaluateAnswer(Interview interview, Question question, Answer answer) {
        try {
            return aiServiceClient.evaluateAnswer(new AiEvaluationRequest(question.getQuestionText(), answer.getAnswerText(),
                interview.getRole().name(), question.getTopic(), question.getDifficulty().name(),
                question.getQuestionType().name()));
        } catch (AiServiceException exception) {
            logger.warn("AI evaluation unavailable for interview {} question {}", interview.getId(), question.getQuestionNumber());
            return null;
        }
        }

        private Question toQuestion(Interview interview, int questionNumber, AiQuestionResponse generated) {
        Question question = new Question();
        question.setInterview(interview);
        question.setQuestionText(generated.question());
        question.setTopic(generated.topic());
        question.setDifficulty(Difficulty.valueOf(generated.difficulty()));
        question.setQuestionType(QuestionType.valueOf(generated.questionType()));
        question.setQuestionNumber(questionNumber);
        question.setExpectedConcepts(String.join(",", generated.expectedConcepts()));
        return question;
        }

        private Evaluation toEvaluation(Answer answer, AiEvaluationResponse result) {
        Evaluation evaluation = new Evaluation();
        evaluation.setAnswer(answer);
        evaluation.setTechnicalCorrectness(result.technicalCorrectness());
        evaluation.setCommunication(result.communication());
        evaluation.setProblemSolving(result.problemSolving());
        evaluation.setCompleteness(result.completeness());
        evaluation.setCodeQuality(result.codeQuality());
        evaluation.setComplexityAnalysis(result.complexityAnalysis());
        evaluation.setOverallScore(result.overallScore());
        evaluation.setStrengths(result.strengths());
        evaluation.setWeaknesses(result.weaknesses());
        evaluation.setMissingConcepts(result.missingConcepts());
        evaluation.setFeedback(result.feedback());
        evaluation.setFollowUpQuestion(result.followUpQuestion());
        evaluation.setRecommendedTopic(result.recommendedTopic());
        return evaluation;
        }

        private String topicFor(Interview interview, int questionNumber) {
        return switch (interview.getRole()) {
            case JAVA_DEVELOPER -> List.of("Java Collections", "OOP", "Multithreading", "JVM")
                .get((questionNumber - 1) % 4);
            case SDE -> List.of("Arrays", "HashMap", "Trees", "Dynamic Programming")
                .get((questionNumber - 1) % 4);
            case FULL_STACK_DEVELOPER -> List.of("REST APIs", "System Design", "JavaScript", "Databases")
                .get((questionNumber - 1) % 4);
        };
        }

        private double average(List<Double> scores) {
        return scores.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        }

    public Interview ownedInterview(String clerkId, UUID id) {
        AppUser user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return interviewRepository.findByIdAndOwnerId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview not found"));
    }

    private record QuestionDraft(String text, String topic, QuestionType type) {
    }
}