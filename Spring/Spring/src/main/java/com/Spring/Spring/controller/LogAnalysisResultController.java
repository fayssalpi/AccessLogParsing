package com.Spring.Spring.controller;

import com.Spring.Spring.entity.LogAnalysisResult;
import com.Spring.Spring.service.LogAnalysisResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5000"})
public class LogAnalysisResultController {

    @Autowired
    private SimpMessagingTemplate template;

    @PostMapping("/saveAnalysis")
    public void saveAnalysis(@RequestBody Map<String, Map<String, Integer>> results) {
        results.forEach((category, data) -> {
            if ("statuses".equals(category)) {
                template.convertAndSend("/topic/logs", data);
            }
        });
    }
}

