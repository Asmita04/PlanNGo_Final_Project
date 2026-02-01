package com.planngo.ticketservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.planngo.ticketservice.dto.EventResponse;


@FeignClient(
        name = "Event-Service",
        url = "http://localhost:9097",
        path = "/events"
)
public interface EventClient {
	@GetMapping("/{eventId}")
	public EventResponse getEventById(@PathVariable int eventId);
	

}
