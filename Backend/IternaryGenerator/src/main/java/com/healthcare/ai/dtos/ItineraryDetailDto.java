package com.healthcare.ai.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ItineraryDetailDto {

    @NotBlank
    private String type;          // "event" or "place"

    @NotBlank
    private String name;

    @NotBlank
    private String location_url;  // must never be null

    @NotBlank
    private String start_time;    // ISO 8601

    @NotBlank
    private String end_time;      // ISO 8601

    @NotBlank
    private String notes;         // REQUIRED by prompt
}
