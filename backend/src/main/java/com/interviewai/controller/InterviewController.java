package com.interviewai.controller;

import com.interviewai.dto.request.AnswerRequest;
import com.interviewai.dto.request.CodeSubmissionRequest;
import com.interviewai.dto.request.InterviewRequest;
import com.interviewai.dto.response.AnswerResponse;
import com.interviewai.dto.response.CodeSubmissionResponse;
import com.interviewai.dto.response.InterviewReportResponse;
import com.interviewai.dto.response.InterviewResponse;
import com.interviewai.entity.Difficulty;
import com.interviewai.entity.InterviewRole;
import com.interviewai.entity.InterviewStatus;
import com.interviewai.service.InterviewService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {
    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InterviewResponse create(@AuthenticationPrincipal Jwt principal,
            @Valid @RequestBody InterviewRequest request) {
        return interviewService.create(principal.getSubject(), request);
    }

    @GetMapping
    public Page<InterviewResponse> list(@AuthenticationPrincipal Jwt principal,
            @RequestParam(required = false) InterviewRole role,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) InterviewStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (page < 0 || size < 1 || size > 50) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pagination parameters");
        }
        return interviewService.list(principal.getSubject(), role, difficulty, status, page, size);
    }

    @GetMapping("/{id}")
    public InterviewResponse get(@AuthenticationPrincipal Jwt principal, @PathVariable UUID id) {
        return interviewService.get(principal.getSubject(), id);
    }

    @PostMapping("/{id}/start")
    public InterviewResponse start(@AuthenticationPrincipal Jwt principal, @PathVariable UUID id) {
        return interviewService.start(principal.getSubject(), id);
    }

    @PostMapping("/{id}/answers")
    public AnswerResponse answer(@AuthenticationPrincipal Jwt principal, @PathVariable UUID id,
            @Valid @RequestBody AnswerRequest request) {
        return interviewService.submitAnswer(principal.getSubject(), id, request);
    }

    @PostMapping("/{id}/code-submit")
    public CodeSubmissionResponse submitCode(@AuthenticationPrincipal Jwt principal, @PathVariable UUID id,
            @Valid @RequestBody CodeSubmissionRequest request) {
        return interviewService.submitCode(principal.getSubject(), id, request);
    }

    @GetMapping("/{id}/report")
    public InterviewReportResponse report(@AuthenticationPrincipal Jwt principal, @PathVariable UUID id) {
        return interviewService.report(principal.getSubject(), id);
    }
}