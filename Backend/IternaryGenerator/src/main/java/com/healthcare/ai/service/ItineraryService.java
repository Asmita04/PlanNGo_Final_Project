package com.healthcare.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.ai.dtos.TouristItineraryRequest;
import com.healthcare.ai.dtos.TouristItineraryResponse;
import com.healthcare.ai.prompts.TouristGuidePrompt2;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final OpenAiService openAiService;
    private final ObjectMapper objectMapper;

    public TouristItineraryResponse generateItinerary(TouristItineraryRequest request) {
        log.info("Starting itinerary generation for request: {}", request);

        // 1. Build the prompts
        String systemPrompt = TouristGuidePrompt2.SYSTEM_PROMPT;
        String userPrompt = buildUserPrompt(request);

        try {
            // 2. Call OpenAI
            String jsonResponse = openAiService.chat(systemPrompt, userPrompt);
            log.debug("Received raw JSON from AI: {}", jsonResponse);

            // 3. Parse and Validate
            TouristItineraryResponse response = objectMapper.readValue(jsonResponse, TouristItineraryResponse.class);
            
            // 4. Validate output
            ItineraryUtils.validateResponse(response);
            
            log.info("Itinerary generated and validated successfully with {} details", 
                     response.getItineraryDetails().size());
            
            return response;

        } catch (Exception e) {
            log.error("AI Generation failed ({}). Switching to fallback.", e.getMessage());
            return generateFallbackItinerary(request, e.getMessage());
        }
    }

    private TouristItineraryResponse generateFallbackItinerary(TouristItineraryRequest request, String errorMessage) {
        log.info("Generating fallback local itinerary.");
        
        TouristItineraryResponse response = new TouristItineraryResponse();
        java.util.List<com.healthcare.ai.dtos.ItineraryDetailDto> details = new java.util.ArrayList<>();
        StringBuilder fullItinerary = new StringBuilder();
        
        fullItinerary.append("NOTE: Due to high demand, this is a simplified itinerary. ");
        fullItinerary.append("Welcome! Based on your bio: ").append(request.getBio()).append("\n\n");

        int dayCount = 1;

        // Add places from request
        if (Boolean.TRUE.equals(request.getExploreCity()) && request.getPlaces() != null) {
            for (String placeName : request.getPlaces()) {
                com.healthcare.ai.dtos.ItineraryDetailDto detail = new com.healthcare.ai.dtos.ItineraryDetailDto();
                detail.setType("place");
                detail.setName(placeName);
                // Simple search link fallback
                detail.setLocation_url("https://www.google.com/maps/search/?api=1&query=" + placeName.replace(" ", "+"));
                
                java.time.LocalDateTime start = java.time.LocalDateTime.now().plusDays(dayCount).withHour(10);
                java.time.LocalDateTime end = start.plusHours(2);
                
                detail.setStart_time(start.toString());
                detail.setEnd_time(end.toString());
                detail.setNotes("Explore this suggested location.");
                details.add(detail);
                
                fullItinerary.append("Day ").append(dayCount).append(": Visit ").append(placeName).append(".\n");
                dayCount++;
            }
        }
        
        // Add events
        if (request.getEvents() != null) {
             for (com.healthcare.ai.dtos.EventDto event : request.getEvents()) {
                com.healthcare.ai.dtos.ItineraryDetailDto detail = new com.healthcare.ai.dtos.ItineraryDetailDto();
                detail.setType("event");
                detail.setName(event.getEvent_name());
                detail.setLocation_url(event.getLocation_url() != null ? event.getLocation_url() : "https://maps.google.com");
                
                detail.setStart_time(event.getStart_time());
                detail.setEnd_time(event.getEnd_time());
                
                detail.setNotes("Scheduled event.");
                details.add(detail);
                
                fullItinerary.append("Event: ").append(event.getEvent_name()).append(".\n");
             }
        }

        // If nothing added, add a generic item
        if (details.isEmpty()) {
             com.healthcare.ai.dtos.ItineraryDetailDto detail = new com.healthcare.ai.dtos.ItineraryDetailDto();
             detail.setType("place");
             detail.setName("City Center Exploration");
             detail.setLocation_url("https://www.google.com/maps");
             
             detail.setStart_time("2026-02-10T10:00:00");
             detail.setEnd_time("2026-02-10T14:00:00");
             
             detail.setNotes("Walk around the city center and enjoy the vibe.");
             details.add(detail);
             fullItinerary.append("Enjoy exploring the city center.");
        }

        response.setItineraryDetails(details);
        response.setFullItinerary(fullItinerary.toString());
        response.setNotesSummary("Generated via fallback mode due to: " + errorMessage);
        
        return response;
    }

    private String buildUserPrompt(TouristItineraryRequest request) {
        String template = TouristGuidePrompt2.USER_PROMPT;

        return template
                .replace("{bio}", request.getBio() != null ? request.getBio() : "None")
                .replace("{notes}", request.getNotes() != null ? request.getNotes() : "None")
                .replace("{events}", request.getEvents() != null ? request.getEvents().toString() : "None")
                .replace("{exploreCity}", String.valueOf(request.getExploreCity()))
                .replace("{places}", request.getPlaces() != null ? request.getPlaces().toString() : "None");
    }
}
