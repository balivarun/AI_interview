package com.interviewai.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    OpenAPI interviewAiOpenApi() {
        return new OpenAPI().info(new Info()
                .title("AI Interview Simulator API")
                .version("v1")
                .description("REST API for the AI Interview Simulator backend."));
    }
}