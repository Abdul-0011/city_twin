package com.example.capstone.repository;

import com.example.capstone.entity.CityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface CityEntityRepository extends JpaRepository<CityEntity, UUID> {
}