package com.healthcare.ai.controller;

import com.healthcare.ai.dtos.TouristItineraryRequest;
import com.healthcare.ai.dtos.TouristItineraryResponse;
import com.healthcare.ai.service.ItineraryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/ai/itinerary")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow CORS for testing
public class TouristItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping(
        value = "/generate",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> generateItinerary(
            @RequestBody TouristItineraryRequest request) {

        log.info("Received itinerary generation request: {}", request);

        // Validate mandatory fields
        if (request == null) {
            log.error("Request body is null");
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("Request body is required"));
        }

        if (request.getBio() == null || request.getBio().isBlank()) {
            log.error("Bio field is missing or empty");
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("Bio field is required and cannot be empty"));
        }

        try {
            log.info("Generating itinerary for bio: {}", request.getBio());
            TouristItineraryResponse response = itineraryService.generateItinerary(request);
            log.info("Successfully generated itinerary");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            log.error("Error generating itinerary", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to generate itinerary: " + ex.getMessage()));
        }
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        error.put("timestamp", java.time.Instant.now().toString());
        return error;
    }
}
