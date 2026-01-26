package com.planNGo.ums.dtos;

import jakarta.validation.constraints.NotBlank;


public record AuthRequest( 
	
	String email,
	@NotBlank
	//@Pattern(regexp="((?=.*\\d)(?=.*[a-z])(?=.*[#@$*]).{5,20})",message = "Blank or invalid password")
	String password
) 
{}
