package com.planNGo.ums.service;

import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.dtos.CustomerResp;
import com.planNGo.ums.dtos.UpdateCustomer;

public interface CustomerService {
//get all users
	//List<OrganizerDTO> getAllOrganizers();
	
	

	ApiResponse deleteCustomer(Long customerId);

	CustomerResp getCustomerDetails(Long customerId);

	ApiResponse updateDetails(Long id, UpdateCustomer customer);
	
	
	
}
