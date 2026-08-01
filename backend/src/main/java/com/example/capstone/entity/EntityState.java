package com.example.capstone.entity;

import jakarta.validation.constraints.NotNull;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "entity_states")
public class EntityState {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "entity_id", nullable = false)
    private CityEntity entity;

    @NotNull
    private Instant timestamp;

    @NotNull
    @Enumerated(EnumType.STRING)
    private MetricType metricType;

    @NotNull
    private Double value;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public CityEntity getEntity() { return entity; }
    public void setEntity(CityEntity entity) { this.entity = entity; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public MetricType getMetricType() { return metricType; }
    public void setMetricType(MetricType metricType) { this.metricType = metricType; }
    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }
}