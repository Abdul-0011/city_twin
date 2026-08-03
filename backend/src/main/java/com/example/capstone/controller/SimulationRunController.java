package com.example.capstone.controller;

import jakarta.validation.Valid;
import com.example.capstone.entity.SimulationRun;
import com.example.capstone.repository.SimulationRunRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/simulations")
public class SimulationRunController {

    private final SimulationRunRepository repository;

    public SimulationRunController(SimulationRunRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<SimulationRun> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public SimulationRun create(@Valid @RequestBody SimulationRun run) {
        return repository.save(run);
    }

    @GetMapping("/{id}")
    public SimulationRun getOne(@PathVariable UUID id) {
        return repository.findById(id).orElseThrow();
    }
}