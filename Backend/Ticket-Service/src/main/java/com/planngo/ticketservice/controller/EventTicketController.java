package com.planngo.ticketservice.controller;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.planngo.ticketservice.dto.*;
import com.planngo.ticketservice.service.EventTicketService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/event-tickets")
@RequiredArgsConstructor
public class EventTicketController {
	private final EventTicketService service;

    @PostMapping
    public EventTicketResponseDTO create(@RequestBody EventTicketRequestDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<EventTicketResponseDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public EventTicketResponseDTO getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public EventTicketResponseDTO update(@PathVariable Integer id,
                                         @RequestBody EventTicketRequestDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
