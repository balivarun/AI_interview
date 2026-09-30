package com.interviewai.service;

import com.interviewai.dto.response.UserResponse;
import com.interviewai.entity.AppUser;
import java.util.List;

public final class UserMapper {
    private UserMapper() {
    }

    public static UserResponse toResponse(AppUser user) {
        List<String> topics = user.getPreferredTopics() == null || user.getPreferredTopics().isBlank()
                ? List.of()
                : List.of(user.getPreferredTopics().split(","));
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getTargetRole(),
                user.getExperience() == null ? null : user.getExperience().name(), topics);
    }
}