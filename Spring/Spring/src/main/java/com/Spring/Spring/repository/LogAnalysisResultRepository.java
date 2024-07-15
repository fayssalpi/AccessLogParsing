package com.Spring.Spring.repository;


import com.Spring.Spring.entity.LogAnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogAnalysisResultRepository extends JpaRepository<LogAnalysisResult, Long> {
}