package com.interviewai.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/topics")
public class TopicController {
    private static final List<String> TOPICS = List.of("OOP", "Java Collections", "Multithreading", "JVM",
            "Exception Handling", "Generics", "Arrays", "Strings", "HashMap", "Linked List", "Trees", "Graphs",
            "Dynamic Programming", "System Design");

    @GetMapping
    public List<String> topics(@RequestParam(required = false) String role) {
        return TOPICS;
    }
}