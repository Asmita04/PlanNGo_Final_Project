package com.planngo.eventservice.dto;

import com.planngo.eventservice.model.EventCategory;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {

    private String title;
    private String description;
    private String eventImage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isApproved;
    private EventCategory category;

    // relationship by ID only
    private Integer venueId;
}