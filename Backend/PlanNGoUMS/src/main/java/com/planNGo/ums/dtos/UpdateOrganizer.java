package com.planNGo.ums.dtos;

import java.time.LocalDate;

import com.planNGo.ums.entities.UserRole;

public record UpdateOrganizer (
		
	String bio,
	String organization,
	Double revenue,
	Boolean isVerified,
	
	Long id,
	String pfp,
	String firstName,
	String lastName,
	String address,
	LocalDate dob,
	String phone,
	UserRole userRole,
	
	
	
	Boolean isEmailVerified
	
	)
	
{}
