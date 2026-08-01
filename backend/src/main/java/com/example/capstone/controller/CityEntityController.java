package com.example.capstone.controller;

import jakarta.validation.Valid;
import com.example.capstone.entity.CityEntity;
import com.example.capstone.repository.CityEntityRepository;
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
public class CityEntityController {

    private final CityEntityRepository repository;

    public CityEntityController(CityEntityRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CityEntity> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public CityEntity create(@Valid @RequestBody CityEntity entity) {
        return repository.save(entity);
    }

    @GetMapping("/{id}")
    public CityEntity getOne(@PathVariable UUID id) {
        return repository.findById(id).orElseThrow();
    }
}