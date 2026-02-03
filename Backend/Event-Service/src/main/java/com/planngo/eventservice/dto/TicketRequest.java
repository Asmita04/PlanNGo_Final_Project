package com.planngo.eventservice.dto;

public record TicketRequest (
	Integer totalQuantity,
	Double price,
	String ticketType) 
{}
