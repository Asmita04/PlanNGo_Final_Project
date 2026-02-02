package com.planngo.ticketservice.service;

import com.planngo.ticketservice.dto.*;

import java.util.List;


public interface TicketService {
	TicketResponseDTO bookTicket(TicketRequestDTO request);
	
	void cancelTicket(Integer ticketId);

    List<TicketResponseDTO> getAllConfirmedTickets();
}
