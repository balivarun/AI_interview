package com.interviewai.client;

import com.fasterxml.jackson.annotation.JsonProperty;

public record WandboxResponse(
        String status,
        @JsonProperty("program_output") String programOutput,
        @JsonProperty("program_error") String programError,
        @JsonProperty("compiler_output") String compilerOutput,
        @JsonProperty("compiler_error") String compilerError) {
}