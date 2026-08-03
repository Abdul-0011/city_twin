package com.example.capstone.repository;

import com.example.capstone.entity.CityEntity;
import com.example.capstone.entity.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface CityEntityRepository extends JpaRepository<CityEntity, UUID> {
    List<CityEntity> findByType(EntityType type);
}