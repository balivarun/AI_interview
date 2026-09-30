package com.interviewai.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CodeSubmissionRequest(
        @NotNull UUID questionId,
        @NotBlank @Size(max = 50) String language,
        @NotBlank @Size(max = 50000) String code) {
}