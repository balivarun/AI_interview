package com.interviewai.repository;

import com.interviewai.entity.Answer;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, UUID> {
    boolean existsByQuestionId(UUID questionId);
    List<Answer> findAllByInterviewId(UUID interviewId);
    @Query("select a from Answer a join fetch a.question where a.interview.id = :interviewId")
    List<Answer> findAllByInterviewIdWithQuestion(@Param("interviewId") UUID interviewId);
}