package com.interviewai.service;

import org.springframework.stereotype.Service;

@Service
public class MockCodeExecutionService implements CodeExecutionService {
    @Override
    public CodeExecutionResult execute(String language, String code) {
        return new CodeExecutionResult(0, 0, "NOT_CONFIGURED");
    }
}