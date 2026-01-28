package com.planngo.eventservice.controller;

import com.planngo.eventservice.dto.ApiResponse;
import com.planngo.eventservice.dto.VenueRequest;
import com.planngo.eventservice.dto.VenueResponse;
import com.planngo.eventservice.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    // CREATE VENUE
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> createVenue(@RequestBody VenueRequest venueRequest) {
        ApiResponse response = venueService.createVenue(venueRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // UPDATE VENUE
    @PutMapping("/{venueId}")
    public ResponseEntity<ApiResponse> updateVenue(
            @PathVariable Integer venueId,
            @RequestBody VenueRequest venueRequest
    ) {
        ApiResponse response = venueService.updateVenue(venueId, venueRequest);
        return ResponseEntity.ok(response);
    }

    // DELETE VENUE
    @DeleteMapping("/{venueId}")
    public ResponseEntity<ApiResponse> deleteVenue(@PathVariable Integer venueId) {
        ApiResponse response = venueService.deleteVenue(venueId);
        return ResponseEntity.ok(response);
    }

    // GET ALL VENUES
    @GetMapping
    public ResponseEntity<List<VenueResponse>> getAllVenues() {
        List<VenueResponse> venues = venueService.getAllVenues();
        return ResponseEntity.ok(venues);
    }

    // GET VENUE BY ID
    @GetMapping("/{venueId}")
    public ResponseEntity<VenueResponse> getVenueDetails(@PathVariable Integer venueId) {
        VenueResponse venue = venueService.getVenueDetails(venueId);
        return ResponseEntity.ok(venue);
    }
}
