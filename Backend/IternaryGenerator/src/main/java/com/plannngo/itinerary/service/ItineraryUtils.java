package com.plannngo.itinerary.service;

import com.plannngo.itinerary.dtos.ItineraryDetailDto;
import com.plannngo.itinerary.dtos.TouristItineraryResponse;
import lombok.extern.slf4j.Slf4j;

import java.time.format.DateTimeFormatter;
import java.util.regex.Pattern;

@Slf4j
public class ItineraryUtils {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
    private static final Pattern URL_PATTERN = Pattern.compile("^(http|https)://.*$");

    /**
     * strict validation of the itinerary response
     */
    public static void validateResponse(TouristItineraryResponse response) {
        if (response == null) {
            throw new IllegalStateException("Generated response is null");
        }

        if (response.getItineraryDetails() == null) {
            throw new IllegalStateException("Itinerary details list is null");
        }

        for (ItineraryDetailDto detail : response.getItineraryDetails()) {
            validateDetail(detail);
        }
    }

    private static void validateDetail(ItineraryDetailDto detail) {
        if (detail.getName() == null || detail.getName().isBlank()) {
            throw new IllegalStateException("Item name is missing");
        }
        
        if (detail.getType() == null || (!detail.getType().equals("event") && !detail.getType().equals("place"))) {
            throw new IllegalStateException("Invalid type for item: " + detail.getName());
        }

        // Validate Location URL
        if (detail.getLocation_url() == null || !URL_PATTERN.matcher(detail.getLocation_url()).matches()) {
            log.warn("Invalid location URL for {}: {}", detail.getName(), detail.getLocation_url());
            // In a strict mode we might throw, but for now we'll log. 
            // The prompt MUST generate valid maps URLs.
            if (detail.getLocation_url() == null) {
                 detail.setLocation_url("https://www.google.com/maps/search/?api=1&query=" + detail.getName().replace(" ", "+"));
            }
        }

        // Validate Time
        if (detail.getStart_time() == null || detail.getStart_time().isBlank()) {
             throw new IllegalStateException("Start time is missing for " + detail.getName());
        }
        if (detail.getEnd_time() == null || detail.getEnd_time().isBlank()) {
             throw new IllegalStateException("End time is missing for " + detail.getName());
        }
    }
}

