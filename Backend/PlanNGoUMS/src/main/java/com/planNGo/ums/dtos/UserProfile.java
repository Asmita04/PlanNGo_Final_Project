package com.planNGo.ums.dtos;

import java.time.LocalDate;


public record UserProfile (
	Long id,	
	String firstName,
	String lastName,
	LocalDate dob,
	String pfp
	
	)
	
{}
