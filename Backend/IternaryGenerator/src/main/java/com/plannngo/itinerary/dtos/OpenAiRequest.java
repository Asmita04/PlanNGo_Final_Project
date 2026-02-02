package com.plannngo.itinerary.dtos;

import lombok.Data;

import java.util.List;

@Data
public class OpenAiRequest {
    private String model;
    private List<OpenAiMessage> messages;
}

