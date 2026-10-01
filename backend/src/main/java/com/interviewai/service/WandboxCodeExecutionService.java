package com.interviewai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewai.client.WandboxRequest;
import com.interviewai.client.WandboxResponse;
import com.interviewai.config.AppProperties;
import java.time.Duration;
import java.util.Locale;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.Exceptions;

@Service
public class WandboxCodeExecutionService implements CodeExecutionService {
    private static final Logger logger = LoggerFactory.getLogger(WandboxCodeExecutionService.class);
    private static final Duration TIMEOUT = Duration.ofSeconds(20);
    private static final Map<String, String> COMPILERS = Map.of(
            "java", "openjdk-jdk-21+35",
            "python", "cpython-3.12.7",
            "c++", "gcc-13.2.0",
            "cpp", "gcc-13.2.0");

    private final WebClient webClient;
    private final String endpoint;
    private final ObjectMapper objectMapper;

    public WandboxCodeExecutionService(WebClient.Builder builder, AppProperties properties, ObjectMapper objectMapper) {
        this.webClient = builder.build();
        this.endpoint = properties.codeExecutionUrl();
        this.objectMapper = objectMapper;
    }

    @Override
    public CodeExecutionResult execute(String language, String code) {
        String compiler = COMPILERS.get(language.toLowerCase(Locale.ROOT));
        if (compiler == null) {
            return new CodeExecutionResult(false, "UNSUPPORTED_LANGUAGE", "", "Unsupported language", "", "");
        }
        try {
            WandboxResponse response = webClient.post()
                    .uri(endpoint)
                    .bodyValue(new WandboxRequest(compiler, code, "", "", "", ""))
                    .exchangeToMono(clientResponse -> {
                        HttpStatusCode status = clientResponse.statusCode();
                        if (!status.is2xxSuccessful()) return clientResponse.createError();
                        return clientResponse.bodyToMono(String.class).map(body -> {
                            try {
                                return objectMapper.readValue(body, WandboxResponse.class);
                            } catch (JsonProcessingException exception) {
                                throw new IllegalStateException("Sandbox returned invalid JSON", exception);
                            }
                        });
                    })
                    .timeout(TIMEOUT)
                    .block();
            if (response == null) throw new IllegalStateException("Code runner returned an empty response");
            boolean succeeded = "0".equals(response.status());
            return new CodeExecutionResult(succeeded, succeeded ? "COMPLETED" : "COMPILE_OR_RUNTIME_ERROR",
                    safe(response.programOutput()), safe(response.programError()),
                    safe(response.compilerOutput()), safe(response.compilerError()));
        } catch (WebClientResponseException exception) {
            int statusCode = exception.getStatusCode().value();
            logger.warn("Sandbox rejected execution request with HTTP {}", statusCode);
            String sandboxMessage = exception.getResponseBodyAsString();
            if (sandboxMessage == null || sandboxMessage.isBlank()) {
                sandboxMessage = exception.getStatusText();
            }
            return new CodeExecutionResult(false, "SANDBOX_REJECTED", "",
                    "Sandbox rejected the execution request (HTTP " + statusCode + "): " + sandboxMessage,
                    "", "");
        } catch (IllegalStateException exception) {
            logger.warn("Sandbox execution failed: {}", exception.getClass().getSimpleName());
            return new CodeExecutionResult(false, "SANDBOX_UNAVAILABLE", "",
                    "Code sandbox is temporarily unavailable.", "", "");
        } catch (RuntimeException exception) {
            Throwable cause = Exceptions.unwrap(exception);
            logger.warn("Sandbox execution failed: {}", cause.getClass().getSimpleName());
            return new CodeExecutionResult(false, "SANDBOX_UNAVAILABLE", "",
                    "Code sandbox is temporarily unavailable.", "", "");
        }
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}