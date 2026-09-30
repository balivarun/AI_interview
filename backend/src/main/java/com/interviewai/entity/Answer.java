package com.interviewai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "answers", indexes = {
        @Index(name = "idx_answers_interview", columnList = "interview_id"),
        @Index(name = "idx_answers_question", columnList = "question_id")
})
@Getter
@Setter
@NoArgsConstructor
public class Answer {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Interview interview;

    @Column(nullable = false, columnDefinition = "text")
    private String answerText;

    @Column(nullable = false)
    private Instant submittedAt = Instant.now();

    @Column(nullable = false)
    private int durationSeconds;

    private Double overallScore;
}