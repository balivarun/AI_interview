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
@Table(name = "code_submissions", indexes = {
        @Index(name = "idx_code_submissions_interview", columnList = "interview_id"),
        @Index(name = "idx_code_submissions_question", columnList = "question_id")
})
@Getter
@Setter
@NoArgsConstructor
public class CodeSubmission {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Interview interview;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Question question;

    @Column(nullable = false, length = 50)
    private String language;

    @Column(nullable = false, columnDefinition = "text")
    private String code;

    @Column(nullable = false)
    private Instant submittedAt = Instant.now();
}