package com.planNGo.ums.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planNGo.ums.custom_exceptions.ResourceNotFoundException;
import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.dtos.CustomerResp;
import com.planNGo.ums.dtos.OrganizerResp;
import com.planNGo.ums.dtos.UpdateCustomer;
import com.planNGo.ums.entities.Customer;
import com.planNGo.ums.entities.Organizer;
import com.planNGo.ums.entities.User;
import com.planNGo.ums.repository.CustomerRepository;
import com.planNGo.ums.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service // spring bean - B.L
@Transactional // auto tx management
@RequiredArgsConstructor
@Slf4j
public class CustomerServiceImpl implements CustomerService {

	private final CustomerRepository customerRepository;
	private final UserRepository userRepository;
	
	@Override
	public ApiResponse deleteCustomer(Long customerId) {
		Customer customer =customerRepository.findById(customerId)
				.orElseThrow(() -> new ResourceNotFoundException("Invalid user id !!!!!"));
			
			User user =customer.getUserDetails();
			user.setIsActive(false);
			
			userRepository.save(user);
			
			return new ApiResponse("Success","User Deactivated");
	}

	@Override
	public CustomerResp getCustomerDetails(Long customerId) {
		Customer customer=customerRepository.findById(customerId)
	    		.orElseThrow(() -> new ResourceNotFoundException("Invalid user id !!!!!"));
	    
	    //incomplete
		return new CustomerResp();
	}

	@Override
	public ApiResponse updateDetails(Long id, UpdateCustomer user) {
		// 1. get user details by id
		User persistentUser= userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Invalid user id !!!!!"));
		//2 . call setters
		
		persistentUser.setFirstName(user.firstName());
		persistentUser.setLastName(user.lastName());
		persistentUser.setBio(user.bio());
		persistentUser.setPhone(user.phone());
		persistentUser.setPfp(user.pfp());
		persistentUser.setAddress(user.address());
		
		//dob
		Customer customer = customerRepository.findByUserDetails(persistentUser)
		.orElseThrow(() -> new ResourceNotFoundException("Invalid User !!!!!"));
		
		customer.setDob(user.dob());
		customer.setGender(user.gender());
		
		userRepository.save(persistentUser);
		customerRepository.save(customer);
		
		//similarly call other setters		
		return new ApiResponse("Success", "Updated customer details");
	}

}
