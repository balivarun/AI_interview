package com.interviewai.repository;

import com.interviewai.entity.Question;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, UUID> {
    List<Question> findAllByInterviewIdOrderByQuestionNumber(UUID interviewId);
    Optional<Question> findByIdAndInterviewId(UUID id, UUID interviewId);
}