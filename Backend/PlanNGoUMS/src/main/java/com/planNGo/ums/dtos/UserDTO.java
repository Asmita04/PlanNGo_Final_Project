package com.planNGo.ums.dtos;

import java.time.LocalDate;

import com.planNGo.ums.entities.Customer;
import com.planNGo.ums.entities.Gender;
import com.planNGo.ums.entities.Organizer;
import com.planNGo.ums.entities.User;
import com.planNGo.ums.entities.UserRole;

import lombok.Builder;

@Builder
public record UserDTO (
	Long id,
	Long customerId,
	Long organizerId,
	String firstName,
	String lastName,
	String phone,
	String address,
	String bio,
	String pfp,
	String email,
	LocalDate createdOn,
	//Customer related
	LocalDate dob,
	Gender gender,
	
	//Organizer related
	String organization,
	Boolean isVerified,
	
	UserRole userRole
	
	)
	
{
	public static UserDTO fromCustomer(Customer customer) {
		return new UserDTO(
				customer.getUserDetails().getId(),
				customer.getId(),
				//org id
				null,
				customer.getUserDetails().getFirstName(),
				customer.getUserDetails().getLastName(),
				customer.getUserDetails().getPhone(),
				customer.getUserDetails().getAddress(),
				customer.getUserDetails().getBio(),
				customer.getUserDetails().getPfp(),
				customer.getUserDetails().getEmail(),
				customer.getUserDetails().getCreatedOn(),
				
				customer.getDob(),
				customer.getGender(),
				
				null,
				null,
				
				customer.getUserDetails().getUserRole()
				);
	}
	
	public static UserDTO fromOrganizer(Organizer organizer) {
		return new UserDTO(
				organizer.getUserDetails().getId(),
				null,
				organizer.getId(),
				organizer.getUserDetails().getFirstName(),
				organizer.getUserDetails().getLastName(),
				organizer.getUserDetails().getPhone(),
				organizer.getUserDetails().getAddress(),
				organizer.getUserDetails().getBio(),
				organizer.getUserDetails().getPfp(),
				organizer.getUserDetails().getEmail(),
				organizer.getUserDetails().getCreatedOn(),
				
				null,
				null,
				
				organizer.getOrganization(),
				organizer.getIsVerified(),
				
				organizer.getUserDetails().getUserRole()
				
				);
	}

	public static UserDTO fromAdmin(User user) {
		return new UserDTO(
				user.getId(),
				null,
				null,
				user.getFirstName(),
				user.getLastName(),
				user.getPhone(),
				user.getAddress(),
				user.getBio(),
				user.getPfp(),
				user.getEmail(),
				user.getCreatedOn(),
				
				null,
				null,
				
				null,
				null,
				
				user.getUserRole()
				);
	}
	
	
	
}



