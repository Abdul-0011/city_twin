package com.example.capstone.controller;

import jakarta.validation.Valid;
import com.example.capstone.dto.EntityStateResponse;
import com.example.capstone.entity.*;
import com.example.capstone.repository.AlertRepository;
import com.example.capstone.repository.EntityStateRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/states")
public class EntityStateController {

    private final EntityStateRepository repository;
    private final AlertRepository alertRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public EntityStateController(EntityStateRepository repository, AlertRepository alertRepository,
                                 SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.alertRepository = alertRepository;
        this.messagingTemplate = messagingTemplate;
    }

    private EntityStateResponse toResponse(EntityState state) {
        return new EntityStateResponse(
                state.getId(),
                state.getEntity().getId(),
                state.getEntity().getName(),
                state.getTimestamp(),
                state.getMetricType().name(),
                state.getValue()
        );
    }

    // Simple threshold rules per metric type — tune these as the project needs
    private void checkThresholds(EntityState state) {
        double value = state.getValue();
        MetricType type = state.getMetricType();
        Double threshold = null;
        AlertSeverity severity = null;

        switch (type) {
            case CONGESTION -> {
                if (value >= 0.9) { threshold = 0.9; severity = AlertSeverity.CRITICAL; }
                else if (value >= 0.7) { threshold = 0.7; severity = AlertSeverity.HIGH; }
            }
            case AIR_QUALITY_INDEX -> {
                if (value >= 150) { threshold = 150.0; severity = AlertSeverity.HIGH; }
            }
            case ENERGY_KWH -> {
                if (value >= 1000) { threshold = 1000.0; severity = AlertSeverity.MEDIUM; }
            }
            default -> {}
        }

        if (threshold != null) {
            Alert alert = new Alert();
            alert.setEntity(state.getEntity());
            alert.setSeverity(severity);
            alert.setType(AlertType.THRESHOLD_BREACH);
            alert.setTriggeredAt(Instant.now());
            alert.setDetail(type.name() + " reached " + value + " (threshold: " + threshold + ")");
            Alert savedAlert = alertRepository.save(alert);
            messagingTemplate.convertAndSend("/topic/alerts", savedAlert.getId());
        }
    }

    @GetMapping
    public List<EntityStateResponse> getAll() {
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @PostMapping
    public EntityStateResponse create(@Valid @RequestBody EntityState state) {
        EntityState saved = repository.save(state);
        checkThresholds(saved);
        EntityStateResponse response = toResponse(saved);
        messagingTemplate.convertAndSend("/topic/entity-states", response);
        return response;
    }

    @GetMapping("/entity/{entityId}")
    public List<EntityStateResponse> getByEntity(@PathVariable UUID entityId) {
        return repository.findByEntity_Id(entityId).stream().map(this::toResponse).collect(Collectors.toList());
    }
}