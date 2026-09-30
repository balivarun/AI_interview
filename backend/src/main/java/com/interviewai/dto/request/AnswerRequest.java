package com.interviewai.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record AnswerRequest(
        @NotNull UUID questionId,
        @NotBlank @Size(max = 20000) String answerText,
        @Min(0) @Max(7200) int durationSeconds) {
}