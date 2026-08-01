package com.example.capstone.repository;

import com.example.capstone.entity.SimulationRun;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SimulationRunRepository extends JpaRepository<SimulationRun, UUID> {
}