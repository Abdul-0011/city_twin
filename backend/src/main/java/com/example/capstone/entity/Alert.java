package com.example.capstone.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "entity_id", nullable = false)
    private CityEntity entity;

    @Enumerated(EnumType.STRING)
    private AlertSeverity severity;

    @Enumerated(EnumType.STRING)
    private AlertType type;

    private Instant triggeredAt;
    private Instant resolvedAt;

    @Column(columnDefinition = "TEXT")
    private String detail;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public CityEntity getEntity() { return entity; }
    public void setEntity(CityEntity entity) { this.entity = entity; }
    public AlertSeverity getSeverity() { return severity; }
    public void setSeverity(AlertSeverity severity) { this.severity = severity; }
    public AlertType getType() { return type; }
    public void setType(AlertType type) { this.type = type; }
    public Instant getTriggeredAt() { return triggeredAt; }
    public void setTriggeredAt(Instant triggeredAt) { this.triggeredAt = triggeredAt; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }
}