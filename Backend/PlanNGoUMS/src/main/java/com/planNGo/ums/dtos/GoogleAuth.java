package com.planNGo.ums.dtos;

import com.planNGo.ums.entities.UserRole;

import jakarta.validation.constraints.NotBlank;


public record GoogleAuth (
	
	@NotBlank
	String googleId,
	
	@NotBlank
	UserRole role
)	
{}
