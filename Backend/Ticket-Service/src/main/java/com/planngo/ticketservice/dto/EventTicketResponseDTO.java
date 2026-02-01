package com.planngo.ticketservice.dto;
import com.planngo.ticketservice.model.TicketType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EventTicketResponseDTO {
	 private Integer ticketTypeId;
	    private Integer eventId;
	    private TicketType typeName;
	    private Double price;
	    private Integer totalQuantity;
}
