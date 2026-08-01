package com.example.capstone.controller;

import com.example.capstone.entity.EntityState;
import com.example.capstone.repository.EntityStateRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/states")
public class EntityStateController {

    private final EntityStateRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public EntityStateController(EntityStateRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping
    public List<EntityState> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public EntityState create(@RequestBody EntityState state) {
        EntityState saved = repository.save(state);
        messagingTemplate.convertAndSend("/topic/entity-states", saved);
        return saved;
    }

    @GetMapping("/entity/{entityId}")
    public List<EntityState> getByEntity(@PathVariable UUID entityId) {
        return repository.findByEntity_Id(entityId);
    }
}