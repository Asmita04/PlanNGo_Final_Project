package com.planNGo.ums.dtos;

import java.time.LocalDate;

import com.planNGo.ums.entities.User;
import com.planNGo.ums.entities.UserRole;

import lombok.Builder;

@Builder
public record UserDTO (
	Long id,	
	String firstName,
	String lastName,
	LocalDate dob,
	String phone,
	String address,
	String email,
	String pfp,
	UserRole userRole
	
	)
	
{
	public static UserDTO fromEntity(User user) {
		return new UserDTO(
		user.getId(),
		user.getFirstName(),
		user.getLastName(),
		user.getDob(),
		user.getPhone(),
		user.getAddress(),
		user.getEmail(),
		user.getPfp(),
		user.getUserRole()
		);
	}
}



