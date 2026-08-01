package com.example.capstone.repository;

import com.example.capstone.entity.EntityState;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface EntityStateRepository extends JpaRepository<EntityState, UUID> {
    List<EntityState> findByEntity_Id(UUID entityId);
}