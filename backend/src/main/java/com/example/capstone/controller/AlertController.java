package com.example.capstone.controller;

import com.example.capstone.dto.AlertResponse;
import com.example.capstone.entity.Alert;
import com.example.capstone.repository.AlertRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertRepository repository;

    public AlertController(AlertRepository repository) {
        this.repository = repository;
    }

    private AlertResponse toResponse(Alert alert) {
        return new AlertResponse(
                alert.getId(),
                alert.getEntity().getId(),
                alert.getEntity().getName(),
                alert.getSeverity().name(),
                alert.getType().name(),
                alert.getTriggeredAt(),
                alert.getResolvedAt(),
                alert.getDetail()
        );
    }

    @GetMapping
    public List<AlertResponse> getAll() {
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @PostMapping
    public AlertResponse create(@RequestBody Alert alert) {
        Alert saved = repository.save(alert);
        return toResponse(saved);
    }

    @GetMapping("/{id}")
    public AlertResponse getOne(@PathVariable UUID id) {
        return toResponse(repository.findById(id).orElseThrow());
    }
}