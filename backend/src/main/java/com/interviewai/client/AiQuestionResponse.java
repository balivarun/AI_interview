package com.interviewai.client;

import java.util.List;

public record AiQuestionResponse(
        String question,
        String topic,
        String difficulty,
        String questionType,
        List<String> expectedConcepts) {
}