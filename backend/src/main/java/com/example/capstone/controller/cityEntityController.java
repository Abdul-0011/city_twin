package com.example.capstone.controller;

import com.example.capstone.entity.cityEntity;
import com.example.capstone.repository.cityEntityRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/entities")
public class cityEntityController {

    private final cityEntityRepository repository;

    public cityEntityController(cityEntityRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<cityEntity> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public cityEntity create(@RequestBody cityEntity entity) {
        return repository.save(entity);
    }

    @GetMapping("/{id}")
    public cityEntity getOne(@PathVariable UUID id) {
        return repository.findById(id).orElseThrow();
    }
}