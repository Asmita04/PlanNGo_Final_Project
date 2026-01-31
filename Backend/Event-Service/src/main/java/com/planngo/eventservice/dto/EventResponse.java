package com.planngo.eventservice.dto;

import com.planngo.eventservice.model.Event;
import com.planngo.eventservice.model.EventCategory;
import lombok.*;

import java.time.LocalDateTime;

@Builder
public record EventResponse(
        Integer eventId,
        String title,
        String description,
        String eventImage,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Boolean isApproved,
        Boolean isExpired,
        VenueResponse venue,
        EventCategory category
) {
    public static EventResponse fromEntity(Event event) {
        return new EventResponse(
                event.getEventId(),
                event.getTitle(),
                event.getDescription(),
                event.getEventImage(),
                event.getStartDate(),
                event.getEndDate(),
                event.getIsApproved(),
                event.getIsExpired(),
                VenueResponse.fromEntity(event.getVenue()),
                event.getCategory()
        );
    }
}