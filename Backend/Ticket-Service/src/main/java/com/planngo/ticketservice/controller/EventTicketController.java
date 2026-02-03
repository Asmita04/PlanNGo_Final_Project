package com.planngo.ticketservice.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.planngo.ticketservice.dto.EventTicketRequestDTO;
import com.planngo.ticketservice.dto.EventTicketResponseDTO;
import com.planngo.ticketservice.service.EventTicketService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/event-tickets")
@RequiredArgsConstructor
public class EventTicketController {
	private final EventTicketService service;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody EventTicketRequestDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }
    
    @GetMapping("/{eventId}/details")
    public List<EventTicketResponseDTO> getByEventId(@PathVariable Integer eventId) {
        return service.getByEventId(eventId);
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
