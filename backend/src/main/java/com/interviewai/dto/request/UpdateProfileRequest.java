package com.interviewai.dto.request;

import com.interviewai.entity.ExperienceLevel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record UpdateProfileRequest(
        @NotBlank @Size(min = 2, max = 120) String name,
        @NotBlank @Email @Size(max = 255) String email,
        @Size(max = 120) String targetRole,
        ExperienceLevel experience,
        @Size(max = 20) List<@Size(max = 80) String> preferredTopics) {
}