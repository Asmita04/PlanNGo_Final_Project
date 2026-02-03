package com.planngo.eventservice.dto;

public record TicketRequest (
	Integer eventId,
	Integer totalQuantity,
	Double price,
	String ticketType) 
{}
