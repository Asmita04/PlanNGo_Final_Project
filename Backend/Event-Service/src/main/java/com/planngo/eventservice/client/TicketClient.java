package com.planngo.eventservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.planngo.eventservice.dto.OrganizerResp;
@FeignClient(
        name = "planNGo-ticketService",
        url = "http://localhost:9099",
        path = "/tickets"
)
public interface TicketClient {

	    // This endpoint is meant ONLY for authorization check
	    @GetMapping("/status/{userId}")
	    OrganizerResp getOrganizerStatus(@PathVariable Long userId);
	
}
