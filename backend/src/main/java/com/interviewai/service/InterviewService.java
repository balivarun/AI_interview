package com.interviewai.service;

import com.interviewai.dto.request.AnswerRequest;
import com.interviewai.dto.request.InterviewRequest;
import com.interviewai.dto.request.CodeSubmissionRequest;
import com.interviewai.dto.response.AnswerResponse;
import com.interviewai.dto.response.CodeSubmissionResponse;
import com.interviewai.dto.response.InterviewResponse;
import com.interviewai.dto.response.InterviewReportResponse;
import com.interviewai.entity.Answer;
import com.interviewai.entity.AppUser;
import com.interviewai.entity.Difficulty;
import com.interviewai.entity.CodeSubmission;
import com.interviewai.entity.Interview;
import com.interviewai.entity.InterviewRole;
import com.interviewai.entity.InterviewStatus;
import com.interviewai.entity.Question;
import com.interviewai.entity.QuestionType;
import com.interviewai.repository.AnswerRepository;
import com.interviewai.repository.CodeSubmissionRepository;
import com.interviewai.repository.InterviewRepository;
import com.interviewai.repository.QuestionRepository;
import com.interviewai.repository.UserRepository;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class InterviewService {
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

    public InterviewService(InterviewRepository interviewRepository, QuestionRepository questionRepository,
            AnswerRepository answerRepository, UserRepository userRepository,
            CodeSubmissionRepository codeSubmissionRepository, CodeExecutionService codeExecutionService) {
        this.interviewRepository = interviewRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
        this.codeSubmissionRepository = codeSubmissionRepository;
        this.codeExecutionService = codeExecutionService;
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

    @Transactional
    public InterviewResponse start(String clerkId, UUID id) {
        Interview interview = ownedInterview(clerkId, id);
        if (interview.getStatus() == InterviewStatus.COMPLETED || interview.getStatus() == InterviewStatus.ABANDONED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Interview cannot be started in its current state");
        }
        if (interview.getStatus() == InterviewStatus.CREATED) {
            interview.setStatus(InterviewStatus.IN_PROGRESS);
            interview.setStartedAt(Instant.now());
            for (int index = 0; index < interview.getTotalQuestions(); index++) {
                QuestionDraft draft = QUESTION_BANK.get(index % QUESTION_BANK.size());
                Question question = new Question();
                question.setInterview(interview);
                question.setQuestionText(draft.text());
                question.setTopic(draft.topic());
                question.setDifficulty(interview.getDifficulty());
                question.setQuestionType(interview.getInterviewType() == com.interviewai.entity.InterviewType.DSA
                        ? QuestionType.DSA : draft.type());
                question.setQuestionNumber(index + 1);
                question.setExpectedConcepts("");
                questionRepository.save(question);
            }
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

    @Transactional
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
        answerRepository.save(answer);

        boolean completed = question.getQuestionNumber() >= interview.getTotalQuestions();
        if (completed) {
            interview.setStatus(InterviewStatus.COMPLETED);
            interview.setCompletedAt(Instant.now());
        } else {
            interview.setCurrentQuestionNumber(interview.getCurrentQuestionNumber() + 1);
        }
        return new AnswerResponse(true, completed, interview.getCurrentQuestionNumber());
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
        List<Double> evaluatedScores = answers.stream().map(Answer::getOverallScore).filter(java.util.Objects::nonNull).toList();
        boolean pending = evaluatedScores.isEmpty();
        double score = pending ? 0 : evaluatedScores.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        String completedAt = DateTimeFormatter.ofPattern("MMMM d, uuuu")
                .withZone(ZoneOffset.UTC).format(interview.getCompletedAt());
        List<String> strengths = pending ? List.of("Answers saved; AI evaluation is pending.") : List.of();
        List<String> weaknesses = pending ? List.of("Evaluation becomes available when the AI service is configured.") : List.of();
        List<InterviewReportResponse.RecommendedTopic> recommendations = List.of(
                new InterviewReportResponse.RecommendedTopic("Java Collections", interview.getDifficulty().name(), "Practice"),
                new InterviewReportResponse.RecommendedTopic("Problem Solving", interview.getDifficulty().name(), "Practice"));
        return new InterviewReportResponse(interview.getId(), interview.getRole().name(),
                interview.getDurationMinutes() + " min", completedAt, score, score, score, score, score, score,
                strengths, weaknesses, recommendations, pending);
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