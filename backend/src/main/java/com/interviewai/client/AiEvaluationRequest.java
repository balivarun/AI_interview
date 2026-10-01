package com.interviewai.client;

public record AiEvaluationRequest(
        String question,
        String answer,
        String role,
        String topic,
        String difficulty,
        String questionType) {
}