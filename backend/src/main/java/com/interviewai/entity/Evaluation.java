package com.interviewai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "evaluations")
@Getter
@Setter
@NoArgsConstructor
public class Evaluation {
    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false, unique = true)
    private Answer answer;

    @Column(nullable = false)
    private double technicalCorrectness;

    @Column(nullable = false)
    private double communication;

    @Column(nullable = false)
    private double problemSolving;

    @Column(nullable = false)
    private double completeness;

    @Column(nullable = false)
    private double codeQuality;

    @Column(nullable = false)
    private double complexityAnalysis;

    @Column(nullable = false)
    private double overallScore;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private List<String> strengths = List.of();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private List<String> weaknesses = List.of();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private List<String> missingConcepts = List.of();

    @Column(nullable = false, columnDefinition = "text")
    private String feedback;

    @Column(columnDefinition = "text")
    private String followUpQuestion;

    @Column(nullable = false, length = 100)
    private String recommendedTopic;
}