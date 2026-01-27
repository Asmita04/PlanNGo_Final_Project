package com.planNGo.ums.dtos;

import java.time.LocalDate;

import com.planNGo.ums.entities.Customer;
import com.planNGo.ums.entities.Gender;
import com.planNGo.ums.entities.User;
import com.planNGo.ums.entities.UserRole;

import lombok.Builder;

@Builder
public record CustomerDTO (
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
	
	
	public static CustomerDTO fromEntity(Customer customer) {
		return new CustomerDTO(
		customer.getUserDetails().getId(),
		customer.getUserDetails().getFirstName(),
		customer.getUserDetails().getLastName(),
		customer.getUserDetails().getPhone(),
		customer.getUserDetails().getAddress(),
		customer.getUserDetails().getBio(),
		customer.getUserDetails().getPfp(),
		customer.getUserDetails().getUserRole(),
		customer.getDob(),
		customer.getGender()
		);
	}
}



