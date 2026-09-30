package com.interviewai.dto.response;

import java.util.List;

public record AnalyticsResponse(
        List<DashboardResponse.PerformancePoint> performance,
        List<Skill> skillBreakdown,
        List<TopicPerformance> topicPerformance) {
    public record Skill(String skill, double score) {
    }
    public record TopicPerformance(String topic, double score) {
    }
}