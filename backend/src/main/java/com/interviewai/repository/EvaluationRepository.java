package com.interviewai.repository;

import com.interviewai.entity.Evaluation;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EvaluationRepository extends JpaRepository<Evaluation, UUID> {
    @Query("select e from Evaluation e where e.answer.interview.id = :interviewId")
    List<Evaluation> findAllForInterview(@Param("interviewId") UUID interviewId);
}