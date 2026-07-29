package com.example.capstone.repository;

import com.example.capstone.entity.cityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface cityEntityRepository extends JpaRepository<cityEntity, UUID> {
}