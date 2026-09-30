package com.interviewai.dto.request;

import com.interviewai.entity.Difficulty;
import com.interviewai.entity.ExperienceLevel;
import com.interviewai.entity.InterviewRole;
import com.interviewai.entity.InterviewType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record InterviewRequest(
        @NotNull InterviewRole role,
        @NotNull ExperienceLevel experience,
        @NotNull Difficulty difficulty,
        @NotNull InterviewType interviewType,
        @Min(1) @Max(15) int totalQuestions,
        @Min(15) @Max(45) int durationMinutes) {
}