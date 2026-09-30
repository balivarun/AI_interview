package com.interviewai.dto.response;

import java.util.List;

public record DashboardResponse(
        List<Stat> stats,
        List<PerformancePoint> performance,
        List<RecentInterview> recentInterviews,
        UserResponse user) {
    public record Stat(String label, String value, String detail) {
    }
    public record PerformancePoint(String date, double score) {
    }
    public record RecentInterview(String id, String role, double score, String difficulty, String date) {
    }
}