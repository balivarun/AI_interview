package com.interviewai.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewai.dto.response.ApiErrorResponse;
import java.time.Instant;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.springframework.security.config.Customizer;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity http, ObjectMapper objectMapper) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(errors -> errors
                    .authenticationEntryPoint((request, response, exception) -> {
                        response.setStatus(401);
                        response.setContentType("application/json");
                        objectMapper.writeValue(response.getOutputStream(), new ApiErrorResponse(
                            Instant.now(), 401, "UNAUTHORIZED", "Authentication is required", request.getRequestURI()));
                    })
                    .accessDeniedHandler((request, response, exception) -> {
                        response.setStatus(403);
                        response.setContentType("application/json");
                        objectMapper.writeValue(response.getOutputStream(), new ApiErrorResponse(
                            Instant.now(), 403, "FORBIDDEN", "Access is denied", request.getRequestURI()));
                    }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/health", "/actuator/health/**")
                        .permitAll()
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**")
                        .permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()))
                .build();
    }

    @Bean
    JwtDecoder jwtDecoder(AppProperties properties) {
        String issuer = configuredIssuer(properties);
        String jwksUri = hasText(properties.clerkJwksUri())
                ? properties.clerkJwksUri()
                : hasText(issuer) ? issuer + "/.well-known/jwks.json" : "https://localhost/.well-known/jwks.json";
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(jwksUri).build();
        OAuth2TokenValidator<Jwt> validator = !hasText(issuer)
                ? JwtValidators.createDefault()
            : new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(issuer),
                new JwtClaimValidator<String>("azp", authorizedParty ->
                    authorizedParty == null || authorizedParty.equals(properties.frontendUrl())));
        decoder.setJwtValidator(validator);
        return decoder;
    }

    private String configuredIssuer(AppProperties properties) {
        if (hasText(properties.clerkIssuer())) return properties.clerkIssuer();
        String key = properties.clerkPublishableKey();
        if (!hasText(key)) return null;
        try {
            String prefix = key.startsWith("pk_test_") ? "pk_test_" : key.startsWith("pk_live_") ? "pk_live_" : null;
            if (prefix == null) return null;
            String encodedDomain = key.substring(prefix.length()).replaceAll("\\$+$", "");
            String domain = new String(Base64.getUrlDecoder().decode(encodedDomain), StandardCharsets.UTF_8);
            return domain.startsWith("http://") || domain.startsWith("https://") ? domain : "https://" + domain;
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}