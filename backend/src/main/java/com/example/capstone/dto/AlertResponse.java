package com.example.capstone.dto;

import java.time.Instant;
import java.util.UUID;

public class AlertResponse {
    private UUID id;
    private UUID entityId;
    private String entityName;
    private String severity;
    private String type;
    private Instant triggeredAt;
    private Instant resolvedAt;
    private String detail;

    public AlertResponse(UUID id, UUID entityId, String entityName, String severity, String type,
                         Instant triggeredAt, Instant resolvedAt, String detail) {
        this.id = id;
        this.entityId = entityId;
        this.entityName = entityName;
        this.severity = severity;
        this.type = type;
        this.triggeredAt = triggeredAt;
        this.resolvedAt = resolvedAt;
        this.detail = detail;
    }

    public UUID getId() { return id; }
    public UUID getEntityId() { return entityId; }
    public String getEntityName() { return entityName; }
    public String getSeverity() { return severity; }
    public String getType() { return type; }
    public Instant getTriggeredAt() { return triggeredAt; }
    public Instant getResolvedAt() { return resolvedAt; }
    public String getDetail() { return detail; }
}