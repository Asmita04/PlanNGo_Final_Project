package com.planngo.eventservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.planngo.eventservice.dto.ApiResponse;
import com.planngo.eventservice.dto.EventRequest;
import com.planngo.eventservice.dto.EventResponse;
import com.planngo.eventservice.service.EventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // Create new event
    @PostMapping(
    	    value = "/register/{userId}",
    	    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    	)
    	public ResponseEntity<ApiResponse> createEvent(
    	        @PathVariable Long userId,
    	        @RequestPart("eventImage") MultipartFile eventImage,
    	        @RequestPart("eventRequest") EventRequest eventRequest
    	) {
    	    ApiResponse response = eventService.createEvent(userId, eventRequest, eventImage);
    	    return new ResponseEntity<>(response, HttpStatus.CREATED);
    	}

    
   
    
    //Get all events
    @GetMapping()
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
            @RequestBody EventRequest eventRequest) {
        ApiResponse response = eventService.updateEvent(eventId, eventRequest);
        return ResponseEntity.ok(response);
    }

    // Delete event
    @DeleteMapping("/{eventId}")
    public ResponseEntity<ApiResponse> deleteEvent(@PathVariable int eventId) {
        ApiResponse response = eventService.deleteEvent(eventId);
        return ResponseEntity.ok(response);
    }
}
