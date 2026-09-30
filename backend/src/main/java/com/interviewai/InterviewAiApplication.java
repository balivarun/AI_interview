package com.interviewai;

import com.interviewai.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class InterviewAiApplication {
    public static void main(String[] args) {
        SpringApplication.run(InterviewAiApplication.class, args);
    }
}