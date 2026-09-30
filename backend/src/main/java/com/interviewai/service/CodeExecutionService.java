package com.interviewai.service;

public interface CodeExecutionService {
    CodeExecutionResult execute(String language, String code);
}