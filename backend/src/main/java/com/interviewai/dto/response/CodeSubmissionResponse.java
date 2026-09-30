package com.interviewai.dto.response;

public record CodeSubmissionResponse(boolean ok, int passed, int total, String status) {
}