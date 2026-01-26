package com.planngo.eventservice.dto;

import com.planngo.eventservice.model.Venue;
import lombok.Builder;

@Builder
public record VenueResponse(
        Integer venueId,
        String venueName,
        String location,
        Integer capacity,
        Boolean isApproved
) {
    public static VenueResponse fromEntity(Venue venue) {
        return new VenueResponse(
                venue.getVenueId(),
                venue.getVenueName(),
                venue.getLocation(),
                venue.getCapacity(),
                venue.getIsApproved()
        );
    }
}
