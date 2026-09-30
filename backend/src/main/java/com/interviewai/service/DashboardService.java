package com.interviewai.service;

import com.interviewai.dto.response.AnalyticsResponse;
import com.interviewai.dto.response.DashboardResponse;
import com.interviewai.entity.AppUser;
import com.interviewai.entity.Interview;
import com.interviewai.entity.InterviewStatus;
import com.interviewai.repository.InterviewRepository;
import com.interviewai.repository.UserRepository;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DashboardService {
    private static final DateTimeFormatter MONTH = DateTimeFormatter.ofPattern("MMM").withZone(ZoneOffset.UTC);
    private static final DateTimeFormatter DAY = DateTimeFormatter.ofPattern("MMM d").withZone(ZoneOffset.UTC);
    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;

    public DashboardService(InterviewRepository interviewRepository, UserRepository userRepository) {
        this.interviewRepository = interviewRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse dashboard(String email) {
        AppUser user = findUser(email);
        UUID userId = user.getId();
        long total = interviewRepository.countByOwnerId(userId);
        Double average = interviewRepository.averageScoreByOwnerIdAndStatus(userId, InterviewStatus.COMPLETED);
        Double best = interviewRepository.bestScoreByOwnerIdAndStatus(userId, InterviewStatus.COMPLETED);
        List<Interview> recent = interviewRepository.findTop6ByOwnerIdAndStatusOrderByCreatedAtDesc(
                userId, InterviewStatus.COMPLETED);
        List<Interview> trend = interviewRepository.findTop12ByOwnerIdAndStatusOrderByCompletedAtDesc(
                userId, InterviewStatus.COMPLETED);
        List<DashboardResponse.Stat> stats = List.of(
                new DashboardResponse.Stat("Interviews", Long.toString(total), "Total attempts"),
                new DashboardResponse.Stat("Average Score", String.format("%.1f", average), "Across completed interviews"),
                new DashboardResponse.Stat("Best Score", String.format("%.1f", best), "Out of 10"),
                new DashboardResponse.Stat("Streak", "0", "Consecutive weeks"));
        return new DashboardResponse(stats, performance(trend), recent.stream().map(this::recentItem).toList(),
                UserMapper.toResponse(user));
    }

    @Transactional(readOnly = true)
    public AnalyticsResponse analytics(String email) {
        AppUser user = findUser(email);
        List<Interview> trend = interviewRepository.findTop12ByOwnerIdAndStatusOrderByCompletedAtDesc(
                user.getId(), InterviewStatus.COMPLETED);
        return new AnalyticsResponse(performance(trend),
                List.of(new AnalyticsResponse.Skill("Technical Knowledge", 0),
                        new AnalyticsResponse.Skill("Problem Solving", 0),
                        new AnalyticsResponse.Skill("Communication", 0),
                        new AnalyticsResponse.Skill("Code Quality", 0),
                        new AnalyticsResponse.Skill("Complexity Analysis", 0)),
                List.of(new AnalyticsResponse.TopicPerformance("Java Collections", 0),
                        new AnalyticsResponse.TopicPerformance("Arrays", 0),
                        new AnalyticsResponse.TopicPerformance("System Design", 0)));
    }

    private List<DashboardResponse.PerformancePoint> performance(List<Interview> interviews) {
        return interviews.reversed().stream()
                .map(interview -> new DashboardResponse.PerformancePoint(
                        MONTH.format(interview.getCompletedAt()), value(interview.getOverallScore())))
                .toList();
    }

    private DashboardResponse.RecentInterview recentItem(Interview interview) {
        return new DashboardResponse.RecentInterview(interview.getId().toString(), interview.getRole().name(),
                value(interview.getOverallScore()), interview.getDifficulty().name(), DAY.format(interview.getCompletedAt()));
    }

        private AppUser findUser(String clerkId) {
                return userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private double value(Double score) {
        return score == null ? 0 : score;
    }
}