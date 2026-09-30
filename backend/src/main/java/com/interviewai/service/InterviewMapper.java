package com.interviewai.service;

import com.interviewai.dto.response.InterviewResponse;
import com.interviewai.dto.response.QuestionResponse;
import com.interviewai.entity.Interview;
import com.interviewai.entity.Question;
import java.util.List;

public final class InterviewMapper {
    private InterviewMapper() {
    }

    public static InterviewResponse toResponse(Interview interview, List<Question> questions) {
        List<QuestionResponse> questionResponses = questions.stream()
                .map(question -> new QuestionResponse(question.getId(), question.getQuestionText(), question.getTopic(),
                        question.getDifficulty().name(), question.getQuestionType().name(), question.getQuestionNumber()))
                .toList();
        String topic = questions.isEmpty() ? "General" : questions.get(0).getTopic();
        return new InterviewResponse(interview.getId(), interview.getRole().name(), interview.getDifficulty().name(),
                interview.getInterviewType().name(), interview.getExperience().name(), interview.getTotalQuestions(),
                interview.getDurationMinutes(), interview.getCurrentQuestionNumber(), interview.getStatus().name(),
                interview.getStartedAt(), interview.getCompletedAt(), topic, questionResponses);
    }
}