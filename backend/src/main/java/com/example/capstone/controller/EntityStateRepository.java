package com.example.capstone.repository;

import com.example.capstone.entity.EntityState;
import com.example.capstone.entity.MetricType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EntityStateRepository extends JpaRepository<EntityState, UUID> {
    List<EntityState> findByEntity_Id(UUID entityId);

    // Latest existing reading for one entity+metric (newest first, capped to one).
    // Lets the controller compare an incoming value against the previous one
    // instead of only a fixed ceiling — needed to detect a drop/trend, not just
    // "value is too high".
    Optional<EntityState> findFirstByEntity_IdAndMetricTypeOrderByTimestampDesc(UUID entityId, MetricType metricType);
}