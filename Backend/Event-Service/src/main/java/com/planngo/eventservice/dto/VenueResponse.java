package com.planngo.eventservice.dto;

import com.planngo.eventservice.model.Venue;
import lombok.Builder;

@Builder
public record VenueResponse(

        Integer venueId,
        String venueName,
        Integer capacity,
        String location,
        String address,
        String city,
        String state,
        String country,
        String postalCode,
        String contactPhone,
        String contactEmail,
        String googleMapsUrl,
        String description,
        Boolean isAvailable

) {
    public static VenueResponse fromEntity(Venue venue) {
        return VenueResponse.builder()
                .venueId(venue.getVenueId())
                .venueName(venue.getVenueName())
                .capacity(venue.getCapacity())
                .location(venue.getLocation())
                .address(venue.getAddress())
                .city(venue.getCity())
                .state(venue.getState())
                .country(venue.getCountry())
                .postalCode(venue.getPostalCode())
                .contactPhone(venue.getContactPhone())
                .contactEmail(venue.getContactEmail())
                .googleMapsUrl(venue.getGoogleMapsUrl())
                .description(venue.getDescription())
                .isAvailable(venue.getIsAvailable())
                .build();
    }
}
