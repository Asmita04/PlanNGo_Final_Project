package com.planngo.ticketservice.dto;

import com.planngo.ticketservice.model.TicketType;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TicketRequestDTO {
	private Integer customerId;
	private Integer eventId;
	private Integer count;
	private TicketType ticketType;

}
