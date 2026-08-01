package com.example.capstone.controller;

import com.example.capstone.dto.EntityStateResponse;
import com.example.capstone.entity.EntityState;
import com.example.capstone.repository.EntityStateRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/states")
public class EntityStateController {

    private final EntityStateRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public EntityStateController(EntityStateRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    private EntityStateResponse toResponse(EntityState state) {
        return new EntityStateResponse(
                state.getId(),
                state.getEntity().getId(),
                state.getEntity().getName(),
                state.getTimestamp(),
                state.getMetricType().name(),
                state.getValue()
        );
    }

    @GetMapping
    public List<EntityStateResponse> getAll() {
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @PostMapping
    public EntityStateResponse create(@RequestBody EntityState state) {
        EntityState saved = repository.save(state);
        EntityStateResponse response = toResponse(saved);
        messagingTemplate.convertAndSend("/topic/entity-states", response);
        return response;
    }

    @GetMapping("/entity/{entityId}")
    public List<EntityStateResponse> getByEntity(@PathVariable UUID entityId) {
        return repository.findByEntity_Id(entityId).stream().map(this::toResponse).collect(Collectors.toList());
    }
}