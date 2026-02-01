package com.planngo.ticketservice.dto;
import java.util.List;

import com.planngo.ticketservice.model.TicketType;
import lombok.Data;
@Data
public class EventTicketRequestDTO {
	 private Integer eventId;
	private List<TicketRequest> tickets;
}
