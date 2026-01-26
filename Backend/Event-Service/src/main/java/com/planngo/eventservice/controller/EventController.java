package com.planngo.eventservice.controller;

import com.planngo.eventservice.dto.ApiResponse;
import com.planngo.eventservice.dto.EventRequest;
import com.planngo.eventservice.dto.EventResponse;
import com.planngo.eventservice.model.Event;
import com.planngo.eventservice.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // Create new event
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> createEvent(@RequestBody EventRequest eventRequest) {
        ApiResponse response = eventService.createEvent(eventRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    //Get all events
    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // Get event by ID
    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable int eventId) {
        return ResponseEntity.ok(eventService.getEventDetails(eventId));
    }

    // Update event
    @PutMapping("/{eventId}")
    public ResponseEntity<ApiResponse> updateEvent(
            @PathVariable int eventId,
            @RequestBody Event event) {
        ApiResponse response = eventService.updateEvent(eventId, event);
        return ResponseEntity.ok(response);
    }

    // Delete event
    @DeleteMapping("/{eventId}")
    public ResponseEntity<ApiResponse> deleteEvent(@PathVariable int eventId) {
        ApiResponse response = eventService.deleteEvent(eventId);
        return ResponseEntity.ok(response);
    }
}
