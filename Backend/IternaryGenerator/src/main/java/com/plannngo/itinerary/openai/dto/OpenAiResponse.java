package com.plannngo.itinerary.openai.dto;

import lombok.Data;

import java.util.List;

@Data
public class OpenAiResponse {

    private List<Choice> choices;

    @Data
    public static class Choice {
        private OpenAiMessage message;
    }

    @Data
    public static class OpenAiMessage {
        private String role;
        private String content;
    }
}

