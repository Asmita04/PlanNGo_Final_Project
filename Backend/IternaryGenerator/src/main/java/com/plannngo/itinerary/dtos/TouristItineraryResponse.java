package com.plannngo.itinerary.dtos;

import lombok.Data;
import java.util.List;

@Data
public class TouristItineraryResponse {
    private String fullItinerary;
    private List<ItineraryDetailDto> itineraryDetails;
    private String notesSummary;
}

