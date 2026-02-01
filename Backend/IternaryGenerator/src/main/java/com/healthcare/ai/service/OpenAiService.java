package com.healthcare.ai.service;

import com.healthcare.ai.dtos.OpenAiMessage;
import com.healthcare.ai.dtos.OpenAiRequest;
import com.healthcare.ai.openai.dto.OpenAiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class OpenAiService {

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    @Value("${spring.ai.openai.chat.options.model:gpt-3.5-turbo}")
    private String model;

    @Value("${spring.ai.openai.chat.options.temperature:0.7}")
    private Double temperature;

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    public String chat(String systemPrompt, String userPrompt) {
        try {
            // Build the request payload manually to ensure full control over parameters
            Map<String, Object> payload = Map.of(
                "model", model,
                "temperature", temperature,
                "messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userPrompt)
                ),
                "response_format", Map.of("type", "json_object") // Enforce JSON mode
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            RestTemplate restTemplate = new RestTemplate();

            log.info("Sending request to OpenAI with model: {}", model);
            
            ResponseEntity<OpenAiResponse> response =
                    restTemplate.postForEntity(OPENAI_URL, entity, OpenAiResponse.class);

            if (response.getBody() != null && !response.getBody().getChoices().isEmpty()) {
                return response.getBody().getChoices().get(0).getMessage().getContent();
            }
            
            log.warn("Empty response received from OpenAI");
            return "{}";

        } catch (HttpClientErrorException e) {
            log.error("OpenAI API Error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("AI Provider Error: " + e.getStatusText());
        } catch (Exception e) {
            log.error("Unexpected error calling OpenAI", e);
            throw new RuntimeException("Failed to generate AI response");
        }
    }
}
