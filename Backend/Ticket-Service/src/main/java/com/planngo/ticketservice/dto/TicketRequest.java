package com.planngo.ticketservice.dto;
import lombok.Data;
@Data
public class TicketRequest {
	private Integer totalQuantity;
	private Double price;
	private String ticketType;
}
