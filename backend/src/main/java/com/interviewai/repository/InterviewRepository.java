package com.interviewai.repository;

import com.interviewai.entity.Interview;
import com.interviewai.entity.InterviewStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewRepository extends JpaRepository<Interview, UUID> {
    Optional<Interview> findByIdAndOwnerId(UUID id, UUID ownerId);
    Page<Interview> findAllByOwnerId(UUID ownerId, Pageable pageable);
    Page<Interview> findAllByOwnerIdAndStatus(UUID ownerId, InterviewStatus status, Pageable pageable);
        @Query("select i from Interview i where i.owner.id = :ownerId "
            + "and (:role is null or i.role = :role) "
            + "and (:difficulty is null or i.difficulty = :difficulty) "
            + "and (:status is null or i.status = :status)")
        Page<Interview> searchOwnerInterviews(@Param("ownerId") UUID ownerId,
            @Param("role") com.interviewai.entity.InterviewRole role,
            @Param("difficulty") com.interviewai.entity.Difficulty difficulty,
            @Param("status") InterviewStatus status, Pageable pageable);
    long countByOwnerId(UUID ownerId);
    List<Interview> findTop6ByOwnerIdAndStatusOrderByCreatedAtDesc(UUID ownerId, InterviewStatus status);
    List<Interview> findTop12ByOwnerIdAndStatusOrderByCompletedAtDesc(UUID ownerId, InterviewStatus status);
    List<Interview> findAllByOwnerIdAndStatusOrderByCompletedAtAsc(UUID ownerId, InterviewStatus status);
    @Query("select coalesce(avg(i.overallScore), 0.0) from Interview i where i.owner.id = :ownerId and i.status = :status")
    Double averageScoreByOwnerIdAndStatus(@Param("ownerId") UUID ownerId, @Param("status") InterviewStatus status);
    @Query("select coalesce(max(i.overallScore), 0.0) from Interview i where i.owner.id = :ownerId and i.status = :status")
    Double bestScoreByOwnerIdAndStatus(@Param("ownerId") UUID ownerId, @Param("status") InterviewStatus status);
}