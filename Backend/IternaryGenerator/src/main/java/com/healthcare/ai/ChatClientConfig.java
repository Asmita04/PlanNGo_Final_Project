package com.healthcare.ai;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ai.chat.client.ChatClient;

@Configuration
public class ChatClientConfig {
	 @Bean
	    public ChatClient chatClient(ChatClient.Builder builder) {
	        // Builds the ChatClient from Spring's ChatClient.Builder
	        return builder.build();
	    }
	

}
