package com.Spring.Spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5000"})
public class LogAnalysisResultController {

    @Autowired
    private SimpMessagingTemplate template;

    @PostMapping("/saveAnalysis")
    public void saveAnalysis(@RequestBody Map<String, Map<String, Integer>> results) {
        results.forEach((category, data) -> {
            if ("statuses".equals(category) || "browserFamilies".equals(category) || "osFamilies".equals(category)) {
                template.convertAndSend("/topic/" + category, data);
            }
        });
    }
}
