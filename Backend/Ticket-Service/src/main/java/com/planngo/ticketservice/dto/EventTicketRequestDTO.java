package com.planngo.ticketservice.dto;
import java.util.List;

public record EventTicketRequestDTO (
	Integer eventId,
	 List<TicketRequest> tickets
	 ) 
{
	
}
