package com.Spring.Spring.service;


import com.Spring.Spring.entity.LogAnalysisResult;
import com.Spring.Spring.repository.LogAnalysisResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogAnalysisResultService {
    @Autowired
    private LogAnalysisResultRepository repository;

    public List<LogAnalysisResult> findAll() {
        return repository.findAll();
    }

    public void saveAll(List<LogAnalysisResult> results) {
        repository.saveAll(results);
    }
}
