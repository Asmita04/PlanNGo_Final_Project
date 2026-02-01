package com.healthcare.ai.dtos;

import lombok.Data;

@Data
public class EventDto {
    private String event_name;    // matches prompt
    private String location_url;  // matches prompt
    private String start_time;    // ISO 8601
    private String end_time;      // ISO 8601
}
