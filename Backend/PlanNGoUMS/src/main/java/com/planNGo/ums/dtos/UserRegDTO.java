package com.planNGo.ums.dtos;

import com.planNGo.ums.entities.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


public record UserRegDTO (
	
	//String gooogleID,
	
	@NotBlank(message = "FirstName is required")
	@Size(min=3,max=20,message="first name must min 3 chars and max 20 chars")
	String firstName,
	@NotBlank
	String lastName,

	@NotBlank   @Email
	String email,
	@NotBlank
	@Pattern(regexp="((?=.*\\d)(?=.*[a-z])(?=.*[#@$*]).{5,20})")
	String password,

	@NotBlank
	String phone,
	
	UserRole userRole
)
{}
