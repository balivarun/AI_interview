package com.interviewai.dto.response;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record InterviewResponse(
        UUID id,
        String role,
        String difficulty,
        String type,
        String experience,
        int totalQuestions,
        int durationMinutes,
        int currentQuestion,
        String status,
        Instant startedAt,
        Instant completedAt,
        String topic,
        List<QuestionResponse> questions) {
}