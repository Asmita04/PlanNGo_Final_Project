package com.planNGo.ums.dtos;

import java.time.LocalDate;

import com.planNGo.ums.entities.User;
import com.planNGo.ums.entities.UserRole;

import lombok.Builder;

@Builder
public record UpdateUser (
		
	String firstName,
	String lastName,

	String phone,
	String bio,
	String pfp,
	UserRole userRole
	
	)
	
{
	public static UpdateUser fromEntity(User user) {
		return new UpdateUser(
		
		user.getFirstName(),
		user.getLastName(),
	
		user.getPhone(),
		

		user.getBio(),
		user.getPfp(),
		user.getUserRole()
		);
	}
}



