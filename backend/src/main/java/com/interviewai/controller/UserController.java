package com.interviewai.controller;

import com.interviewai.dto.request.UpdateProfileRequest;
import com.interviewai.dto.request.SyncClerkUserRequest;
import com.interviewai.dto.response.UserResponse;
import com.interviewai.service.UserMapper;
import com.interviewai.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserResponse me(@AuthenticationPrincipal Jwt principal) {
        return UserMapper.toResponse(userService.getByClerkId(principal.getSubject()));
    }

    @PutMapping
    public UserResponse update(@AuthenticationPrincipal Jwt principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        return userService.update(principal.getSubject(), request);
    }

    @PostMapping("/sync")
    public UserResponse sync(@AuthenticationPrincipal Jwt principal,
            @Valid @RequestBody SyncClerkUserRequest request) {
        return userService.syncClerkUser(principal.getSubject(), request.name(), request.email());
    }
}