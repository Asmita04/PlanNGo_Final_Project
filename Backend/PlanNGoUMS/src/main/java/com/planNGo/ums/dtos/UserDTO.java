package com.planNGo.ums.dtos;

import java.time.LocalDate;

import com.planNGo.ums.entities.Customer;
import com.planNGo.ums.entities.Gender;
import com.planNGo.ums.entities.Organizer;
import com.planNGo.ums.entities.User;
import com.planNGo.ums.entities.UserRole;
import com.planNGo.ums.repository.CustomerRepository;
import com.planNGo.ums.repository.UserRepository;

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

	//Customer related
	LocalDate dob,
	Gender gender,
	
	//Organizer related
	String organization,
	
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
				
				
				customer.getDob(),
				customer.getGender(),
				
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
				
				
				null,
				null,
				
				organizer.getOrganization(),
				
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
				
				
				null,
				null,
				
				null,
				
				user.getUserRole()
				);
	}
	
	
	
}



