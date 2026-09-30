package com.interviewai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "questions", indexes = {
        @Index(name = "idx_questions_interview_number", columnList = "interview_id, questionNumber")
})
@Getter
@Setter
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Interview interview;

    @Column(nullable = false, columnDefinition = "text")
    private String questionText;

    @Column(nullable = false, length = 100)
    private String topic;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private QuestionType questionType;

    @Column(nullable = false)
    private int questionNumber;

    @Column(columnDefinition = "text")
    private String expectedConcepts = "";

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}