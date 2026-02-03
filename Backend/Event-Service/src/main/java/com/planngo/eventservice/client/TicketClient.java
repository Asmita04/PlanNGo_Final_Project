package com.planngo.eventservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.planngo.eventservice.dto.EventRequest;
import com.planngo.eventservice.dto.EventTicketRequestDTO;
import com.planngo.eventservice.dto.TicketRequest;

@FeignClient(
        name = "TICKET-SERVICE",
        url = "http://localhost:9099",
        path = "/event-tickets"
)
public interface TicketClient {

	    // This endpoint is meant ONLY for authorization check
	    @PostMapping
	    ResponseEntity<?> create(@RequestBody EventTicketRequestDTO eventTicketRequestDTO);
	
}
