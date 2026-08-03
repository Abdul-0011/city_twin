package com.example.capstone.dto;

import java.time.Instant;
import java.util.UUID;

public class EntityStateResponse {
    private UUID id;
    private UUID entityId;
    private String entityName;
    private Instant timestamp;
    private String metricType;
    private Double value;

    public EntityStateResponse(UUID id, UUID entityId, String entityName, Instant timestamp, String metricType, Double value) {
        this.id = id;
        this.entityId = entityId;
        this.entityName = entityName;
        this.timestamp = timestamp;
        this.metricType = metricType;
        this.value = value;
    }

    public UUID getId() { return id; }
    public UUID getEntityId() { return entityId; }
    public String getEntityName() { return entityName; }
    public Instant getTimestamp() { return timestamp; }
    public String getMetricType() { return metricType; }
    public Double getValue() { return value; }
}