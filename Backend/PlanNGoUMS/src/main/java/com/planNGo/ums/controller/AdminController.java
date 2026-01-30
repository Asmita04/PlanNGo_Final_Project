package com.planNGo.ums.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planNGo.ums.dtos.OrganizerDTO;
import com.planNGo.ums.dtos.UserDTO;
import com.planNGo.ums.service.AdminService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController //= @Controller + @ResponseBody
@RequestMapping("/admin")  //base url-pattern

@RequiredArgsConstructor //Creates a parameterized ctor having final & non null fields
@Validated
@Slf4j
public class AdminController {
	//depcy 	
	private final AdminService adminService;
	
	@GetMapping("/getUsers")
	public ResponseEntity<?> getAllUsers() {
		System.out.println("in render user list");
		List<UserDTO> list = adminService.getAllUsers();
		if(list.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT)
					.build(); //only status code : 204
		//=> non empty body
		return ResponseEntity.ok(list); //SC 200 + List -> Json[]
	}

	@GetMapping("/getOrganizers")
	public ResponseEntity<?> getAllOrganizers() {
		System.out.println("in render organizer list");
		List<OrganizerDTO> list = adminService.getAllOrganizers();
		if(list.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT)
					.build(); //only status code : 204
		//=> non empty body
		return ResponseEntity.ok(list); //SC 200 + List -> Json[]
	}
	

	@PutMapping("/verify/{Id}")
	//swagger annotation - use till testing phase
	@Operation(description ="Complete Update customer details")
	public ResponseEntity<?> updateCustomerDetails(@PathVariable Long id) {
		

		System.out.println("in update "+id);
		
			return ResponseEntity.ok(adminService.verifyOrganizer(id));
		
	}
	
	
	
	


}
