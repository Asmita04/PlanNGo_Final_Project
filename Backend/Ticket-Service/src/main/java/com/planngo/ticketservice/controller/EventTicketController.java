package com.planngo.ticketservice.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<EventTicketResponseDTO>> create(@RequestBody EventTicketRequestDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping
    public List<EventTicketResponseDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public EventTicketResponseDTO getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/price")
    public ResponseEntity<Double> getPriceForTicketType(
            @RequestParam Integer eventId,
            @RequestParam String ticketType) {

        return ResponseEntity.ok(
                service.getPriceForTicketType(eventId, ticketType)
        );
    }

}
