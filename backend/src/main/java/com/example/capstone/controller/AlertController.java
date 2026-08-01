package com.example.capstone.controller;

import com.example.capstone.entity.Alert;
import com.example.capstone.repository.AlertRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertRepository repository;

    public AlertController(AlertRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Alert> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Alert create(@RequestBody Alert alert) {
        return repository.save(alert);
    }

    @GetMapping("/{id}")
    public Alert getOne(@PathVariable UUID id) {
        return repository.findById(id).orElseThrow();
    }
}