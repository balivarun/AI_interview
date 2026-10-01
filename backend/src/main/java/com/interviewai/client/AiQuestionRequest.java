package com.interviewai.client;

import java.util.List;

public record AiQuestionRequest(
        String role,
        String experience,
        String difficulty,
        String topic,
        List<String> previousQuestions,
        List<String> weakTopics,
        int questionNumber) {
}