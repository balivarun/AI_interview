package com.interviewai.client;

import com.fasterxml.jackson.annotation.JsonProperty;

public record WandboxRequest(
        String compiler,
        String code,
        String stdin,
        String options,
        @JsonProperty("compiler-option-raw") String compilerOptionRaw,
        @JsonProperty("runtime-option-raw") String runtimeOptionRaw) {
}