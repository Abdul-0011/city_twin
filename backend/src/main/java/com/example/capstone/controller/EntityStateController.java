package com.example.capstone.controller;

import jakarta.validation.Valid;
import com.example.capstone.dto.AlertResponse;
import com.example.capstone.dto.EntityStateResponse;
import com.example.capstone.entity.*;
import com.example.capstone.repository.AlertRepository;
import com.example.capstone.repository.EntityStateRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
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

    private AlertResponse toAlertResponse(Alert alert) {
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
            messagingTemplate.convertAndSend("/topic/alerts", toAlertResponse(savedAlert));
        }
    }

    // Trend-based check. checkThresholds() above only catches a value that is too
    // HIGH against a fixed ceiling — it has no case for POPULATION, so a falling
    // population never triggered anything, no matter how far it fell. A "drop" is
    // inherently about change over time, so this compares the incoming value
    // against the entity's own previous POPULATION reading instead of a constant.
    // Same pattern can be reused for OCCUPANCY/AVG_SPEED later if they need it too.
    private void checkPopulationDrop(EntityState incoming) {
        if (incoming.getMetricType() != MetricType.POPULATION || incoming.getEntity() == null
                || incoming.getEntity().getId() == null) {
            return;
        }

        Optional<EntityState> previous = repository.findFirstByEntity_IdAndMetricTypeOrderByTimestampDesc(
                incoming.getEntity().getId(), MetricType.POPULATION);
        if (previous.isEmpty()) return; // first reading ever for this zone — nothing to compare against

        double before = previous.get().getValue();
        double after = incoming.getValue();
        if (before <= 0) return; // avoid divide-by-zero / meaningless percentage

        double percentDrop = (before - after) / before; // positive => population fell
        AlertSeverity severity = null;
        if (percentDrop >= 0.20) severity = AlertSeverity.CRITICAL;
        else if (percentDrop >= 0.10) severity = AlertSeverity.HIGH;
        else if (percentDrop >= 0.05) severity = AlertSeverity.MEDIUM;

        if (severity != null) {
            Alert alert = new Alert();
            alert.setEntity(incoming.getEntity());
            alert.setSeverity(severity);
            alert.setType(AlertType.ANOMALY_DETECTED);
            alert.setTriggeredAt(Instant.now());
            alert.setDetail(String.format(
                    "Population dropped %.1f%% (%.0f -> %.0f)", percentDrop * 100, before, after));
            Alert savedAlert = alertRepository.save(alert);
            messagingTemplate.convertAndSend("/topic/alerts", toAlertResponse(savedAlert));
        }
    }

    @GetMapping
    public List<EntityStateResponse> getAll() {
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @PostMapping
    public EntityStateResponse create(@Valid @RequestBody EntityState state) {
        checkPopulationDrop(state); // must run BEFORE save — needs the old "latest" row, not the new one
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