package com.interviewai.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
	String frontendUrl, String aiServiceUrl, String clerkIssuer, String clerkJwksUri,
	String clerkPublishableKey, String codeExecutionUrl) {
}