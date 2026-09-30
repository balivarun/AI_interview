package com.interviewai.repository;

import com.interviewai.entity.AppUser;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser, UUID> {
    Optional<AppUser> findByEmailIgnoreCase(String email);
    Optional<AppUser> findByClerkId(String clerkId);
    boolean existsByEmailIgnoreCase(String email);
}