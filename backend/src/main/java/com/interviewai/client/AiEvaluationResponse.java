package com.interviewai.client;

import java.util.List;

public record AiEvaluationResponse(
        double technicalCorrectness,
        double communication,
        double problemSolving,
        double completeness,
        double codeQuality,
        double complexityAnalysis,
        double overallScore,
        List<String> strengths,
        List<String> weaknesses,
        List<String> missingConcepts,
        String feedback,
        String followUpQuestion,
        String recommendedTopic) {
}