package com.interviewai.repository;

import com.interviewai.entity.Answer;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, UUID> {
    boolean existsByQuestionId(UUID questionId);
    List<Answer> findAllByInterviewId(UUID interviewId);
}