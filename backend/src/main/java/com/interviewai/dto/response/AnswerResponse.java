package com.interviewai.dto.response;

public record AnswerResponse(boolean ok, boolean completed, int currentQuestion, boolean evaluationPending) {
}