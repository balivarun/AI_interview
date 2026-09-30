package com.interviewai.repository;

import com.interviewai.entity.CodeSubmission;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeSubmissionRepository extends JpaRepository<CodeSubmission, UUID> {
}