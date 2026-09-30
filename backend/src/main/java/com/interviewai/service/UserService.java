package com.interviewai.service;

import com.interviewai.dto.request.UpdateProfileRequest;
import com.interviewai.dto.response.UserResponse;
import com.interviewai.entity.AppUser;
import com.interviewai.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public AppUser getByClerkId(String clerkId) {
        return userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Transactional
    public UserResponse syncClerkUser(String clerkId, String name, String email) {
        AppUser user = userRepository.findByClerkId(clerkId).orElse(null);
        if (user == null) {
            user = userRepository.findByEmailIgnoreCase(email).orElseGet(AppUser::new);
            if (user.getClerkId() != null && !user.getClerkId().equals(clerkId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is linked to another account");
            }
            user.setClerkId(clerkId);
            user.setName(name.trim());
            user.setEmail(email.trim().toLowerCase());
            if (user.getPasswordHash() == null) user.setPasswordHash("CLERK_MANAGED");
        }
        if (user.getTargetRole() == null) user.setTargetRole("Software Engineer");
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(String clerkId, UpdateProfileRequest request) {
        AppUser user = getByClerkId(clerkId);
        boolean emailTaken = !user.getEmail().equalsIgnoreCase(request.email())
                && userRepository.existsByEmailIgnoreCase(request.email());
        if (emailTaken) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        user.setName(request.name().trim());
        user.setEmail(request.email().trim().toLowerCase());
        user.setTargetRole(request.targetRole());
        user.setExperience(request.experience());
        user.setPreferredTopics(request.preferredTopics() == null ? "" : String.join(",", request.preferredTopics()));
        return UserMapper.toResponse(user);
    }
}