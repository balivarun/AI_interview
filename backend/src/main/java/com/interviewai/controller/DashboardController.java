package com.interviewai.controller;

import com.interviewai.dto.response.AnalyticsResponse;
import com.interviewai.dto.response.DashboardResponse;
import com.interviewai.service.DashboardService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/api/dashboard")
    public DashboardResponse dashboard(@AuthenticationPrincipal Jwt principal) {
        return dashboardService.dashboard(principal.getSubject());
    }

    @GetMapping("/api/analytics")
    public AnalyticsResponse analytics(@AuthenticationPrincipal Jwt principal) {
        return dashboardService.analytics(principal.getSubject());
    }
}