package com.example.capstone.controller;

import com.example.capstone.entity.EntityState;
import com.example.capstone.repository.EntityStateRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/states")
public class EntityStateController {

    private final EntityStateRepository repository;

    public EntityStateController(EntityStateRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<EntityState> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public EntityState create(@RequestBody EntityState state) {
        return repository.save(state);
    }

    @GetMapping("/entity/{entityId}")
    public List<EntityState> getByEntity(@PathVariable UUID entityId) {
        return repository.findByEntity_Id(entityId);
    }
}