package com.plannngo.itinerary.dtos;

import lombok.Data;
import java.util.List;

@Data
public class TouristItineraryRequest {

    private String bio;
    private String notes;

    private String exploreCity;   // Changed to String to accept City Name or "true"

    private List<String> places;   // Used ONLY if exploreCity = true

    private List<EventDto> events; // Matches prompt
}

