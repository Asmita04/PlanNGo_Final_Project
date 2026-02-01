package com.healthcare.ai.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OpenAiMessage {
    private String role; // "system" or "user"
    private String content;
}
