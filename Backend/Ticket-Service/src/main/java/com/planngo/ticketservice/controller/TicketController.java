package com.planngo.ticketservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.planngo.ticketservice.dto.*;
import com.planngo.ticketservice.service.TicketService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {
	 private final TicketService ticketService;

	    @PostMapping
	    public ResponseEntity<TicketResponseDTO> bookTicket(
	            @RequestBody TicketRequestDTO request) {

	        return ResponseEntity.ok(ticketService.bookTicket(request));
	    }

	    @PutMapping("/{ticketId}/cancel")
	    public ResponseEntity<String> cancelTicket(
	            @PathVariable Integer ticketId) {

	        ticketService.cancelTicket(ticketId);
	        return ResponseEntity.ok("Ticket cancelled successfully");
	    }
}
