package com.planngo.eventservice.dto;

import com.planngo.eventservice.model.Venue;
import lombok.Builder;

@Builder
public record VenueResponse(
        String venueName,
        String city,
        String location,
        String locationURL,
        Integer capacity,
        Boolean isAvailable
) {
    public static VenueResponse fromEntity(Venue venue) {
        return new VenueResponse(
                venue.getVenueName(),
                venue.getCity(),
                venue.getLocation(),
                venue.getLocationURL(),
                venue.getCapacity(),
                venue.getIsAvailable()
        );
    }
}
