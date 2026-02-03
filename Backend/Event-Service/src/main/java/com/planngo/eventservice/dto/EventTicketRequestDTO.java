package com.planngo.eventservice.dto;
import java.util.List;

import lombok.Data;
@Data
public class EventTicketRequestDTO {
	Integer eventId;
	private List<TicketRequest> tickets;
}
