package com.planNGo.ums.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planNGo.ums.dtos.CustomerResp;
import com.planNGo.ums.dtos.UpdateCustomer;
import com.planNGo.ums.service.CustomerService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController //= @Controller + @ResponseBody
@RequestMapping("/customer")  //base url-pattern

@RequiredArgsConstructor //Creates a parameterized ctor having final & non null fields
@Validated
@Slf4j
public class CustomerController {
	//depcy 	
	private final CustomerService customerService;
	

//	@GetMapping
//	public /* @ResponseBody */  ResponseEntity<?> renderOrgainzerList() {
//		System.out.println("in render user list");
//		List<OrganizerDTO> list = organizerService.getAllOrganizers();
//		if(list.isEmpty())
//			return ResponseEntity.status(HttpStatus.NO_CONTENT)
//					.build(); //only status code : 204
//		//=> non empty body
//		return ResponseEntity.ok(list); //SC 200 + List -> Json[]
//	}
	
	
	
	
	@GetMapping("/{customerId}")
	public ResponseEntity<CustomerResp> getCustomerDetails(@PathVariable Long customerId) {
		System.out.println("in get organizer details "+customerId);
	
			return ResponseEntity.ok(
					customerService.getCustomerDetails(customerId));
		
	}
	


	@PutMapping("/profile/{Id}")
	//swagger annotation - use till testing phase
	@Operation(description ="Complete Update customer details")
	public ResponseEntity<?> updateCustomerDetails(@PathVariable Long Id,@RequestBody UpdateCustomer user) {
		log.info("***** in customer update{} ",user);

		System.out.println("in update "+Id+" "+user);
		
			return ResponseEntity.ok(customerService.updateDetails(Id,user));
		
	}
	


}
