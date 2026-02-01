package com.planngo.ticketservice.service;

import com.planngo.ticketservice.dto.*;


public interface TicketService {
	TicketResponseDTO bookTicket(TicketRequestDTO request);
	
	void cancelTicket(Integer ticketId);

}
