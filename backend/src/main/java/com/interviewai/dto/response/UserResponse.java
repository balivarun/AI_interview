package com.interviewai.dto.response;

import java.util.List;
import java.util.UUID;

public record UserResponse(
        UUID id, String name, String email, String targetRole, String experience, List<String> preferredTopics) {
}