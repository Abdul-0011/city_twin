package com.example.capstone.repository;

import com.example.capstone.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AlertRepository extends JpaRepository<Alert, UUID> {
}