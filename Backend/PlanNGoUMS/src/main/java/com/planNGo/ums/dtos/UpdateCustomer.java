package com.planNGo.ums.dtos;

import java.time.LocalDate;

import com.planNGo.ums.entities.Customer;
import com.planNGo.ums.entities.Gender;
import com.planNGo.ums.entities.User;
import com.planNGo.ums.entities.UserRole;

import lombok.Builder;

@Builder
public record UpdateCustomer (
	Long id,	
	String firstName,
	String lastName,
	
	String phone,
	String address,
	
	String bio,
	String pfp,
	
	UserRole userRole,
	LocalDate dob,
	Gender gender
	
	)
	
{
	public static UpdateCustomer fromEntity(User user,Gender gender,LocalDate dob) {
		return new UpdateCustomer(
		user.getId(),
		user.getFirstName(),
		user.getLastName(),
		user.getPhone(),
		user.getAddress(),
		user.getBio(),
		user.getPfp(),
		user.getUserRole(),
		dob,
		gender
		);
	}
	
	
}



