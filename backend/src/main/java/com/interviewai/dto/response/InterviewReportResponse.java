package com.interviewai.dto.response;

import java.util.List;
import java.util.UUID;

public record InterviewReportResponse(
        UUID id,
        String role,
        String duration,
        String completedAt,
        double score,
        double technicalKnowledge,
        double problemSolving,
        double communication,
        double codeQuality,
        double complexityAnalysis,
        List<String> strengths,
        List<String> weaknesses,
        List<RecommendedTopic> recommendedTopics,
        boolean evaluationPending,
        int evaluatedQuestions,
        int totalAnswers) {
    public record RecommendedTopic(String title, String difficulty, String action) {
    }
}