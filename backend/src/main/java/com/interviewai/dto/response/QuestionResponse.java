package com.interviewai.dto.response;

import java.util.UUID;

public record QuestionResponse(
        UUID id, String prompt, String topic, String difficulty, String type, int questionNumber) {
}