package com.interviewai.client;

import java.time.Duration;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.Exceptions;

@Component
public class AiServiceClient {
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(35);
    private final WebClient webClient;

    public AiServiceClient(WebClient.Builder builder, com.interviewai.config.AppProperties properties) {
        this.webClient = builder.baseUrl(properties.aiServiceUrl()).build();
    }

    public AiQuestionResponse generateQuestion(AiQuestionRequest request) {
        return send("/ai/generate-question", request, AiQuestionResponse.class);
    }

    public AiEvaluationResponse evaluateAnswer(AiEvaluationRequest request) {
        return send("/ai/evaluate-answer", request, AiEvaluationResponse.class);
    }

    private <T> T send(String path, Object request, Class<T> responseType) {
        try {
            T result = webClient.post()
                    .uri(path)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(responseType)
                    .timeout(REQUEST_TIMEOUT)
                    .block();
            if (result == null) throw new IllegalStateException("AI service returned an empty response");
            return result;
        } catch (WebClientRequestException | WebClientResponseException | IllegalStateException exception) {
            throw new AiServiceException("AI service request failed", Exceptions.unwrap(exception));
        }
    }
}