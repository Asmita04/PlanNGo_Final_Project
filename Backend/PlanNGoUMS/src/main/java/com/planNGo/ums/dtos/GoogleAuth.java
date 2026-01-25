package com.planNGo.ums.dtos;

import javax.management.relation.Role;

import com.planNGo.ums.entities.UserRole;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class GoogleAuth {
	
	@NotBlank
	private String googleId;
	
	@NotBlank
	private UserRole role;
	
}
