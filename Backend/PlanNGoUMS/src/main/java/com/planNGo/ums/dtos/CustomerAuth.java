package com.planNGo.ums.dtos;

public record CustomerAuth (
	String token,
	CustomerDTO user,
	String message
) 
{}
