package com.healthcare.ai.dtos;

import lombok.Data;
import java.util.List;

@Data
public class TouristItineraryRequest {

    private String bio;
    private String notes;

    private Boolean exploreCity;   // NEW (required by prompt)

    private List<String> places;   // Used ONLY if exploreCity = true

    private List<EventDto> events; // Matches prompt
}
