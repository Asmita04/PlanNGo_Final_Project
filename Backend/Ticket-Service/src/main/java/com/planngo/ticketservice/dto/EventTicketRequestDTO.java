package com.planngo.ticketservice.dto;
import com.planngo.ticketservice.model.TicketType;
import lombok.Data;
@Data
public class EventTicketRequestDTO {
	 private Integer eventId;
	    private TicketType typeName;
	    private Double price;
	    private Integer totalQuantity;
}
