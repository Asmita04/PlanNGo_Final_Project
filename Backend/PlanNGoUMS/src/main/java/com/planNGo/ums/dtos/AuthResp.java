package com.planNGo.ums.dtos;

public record AuthResp (
	String token,
	UserDTO user,
	String message
) 
{}
