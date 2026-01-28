package com.planNGo.ums.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.planNGo.ums.dtos.AuthRequest;
import com.planNGo.ums.dtos.UpdateCustomer;
import com.planNGo.ums.dtos.UpdateOrganizer;
import com.planNGo.ums.dtos.UserDTO;
import com.planNGo.ums.dtos.UserRegDTO;
import com.planNGo.ums.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController //= @Controller + @ResponseBody
@RequestMapping("/users")  //base url-pattern
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor //Creates a parameterized ctor having final & non null fields
@Validated
@Slf4j
public class UserController {
	//depcy 	
	private final UserService userService;	
	

	@GetMapping
	public /* @ResponseBody */  ResponseEntity<?> renderUserList() {
		System.out.println("in render user list");
		List<UserDTO> list = userService.getAllUsers();
		if(list.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT)
					.build(); //only status code : 204
		//=> non empty body
		return ResponseEntity.ok(list); //SC 200 + List -> Json[]
	}
	
	@GetMapping("/{userId}")
	public ResponseEntity<?> getUserDetails(@PathVariable  @Min(1) @Max(100) Long userId) {
		System.out.println("in get user details "+userId);
	
			return ResponseEntity.ok(
					userService.getUserDetails(userId));
		
	}
	 
	@PutMapping("/customer/profile/{userId}")
	//swagger annotation - use till testing phase
	@Operation(description ="Complete Update customer details")
	public ResponseEntity<?> updateCustomerDetails( @PathVariable Long userId,@RequestBody UpdateCustomer user) {
		log.info("***** in user update{} ",user);

		 
		    
		System.out.println("in update "+userId+" "+user);
		
			return ResponseEntity.ok(userService.updateCustomerDetails(userId,user));
		
	}
	@PutMapping("/organizer/profile/{userId}")
	//swagger annotation - use till testing phase
	@Operation(description ="Complete Update organizer details")
	public ResponseEntity<?> updateOrganizerDetails(@PathVariable Long userId,@RequestBody UpdateOrganizer user) {
		log.info("***** in user update{} ",user);

		System.out.println("in update "+userId+" "+user);
		
			return ResponseEntity.ok(userService.updateOrganizerDetails(userId,user));
		
	}

	@PostMapping("/signin")
	@Operation(description = "User Login")
	public ResponseEntity<?> userSignIn(@RequestBody @Valid  AuthRequest request) {
		log.info("***** in user sign in {} ",request);		
			return ResponseEntity.ok(userService.authenticate(request));		
	}
	
	@PostMapping("/signup")
	@Operation(description = "User SignUp")
	public ResponseEntity<?> userSignUp(@RequestBody @Valid  UserRegDTO request) {
		log.info("***** in user sign in {} ",request);		
			return ResponseEntity.ok(userService.register(request));		
	}
	
	@PatchMapping("/pwd-encryption")
	@Operation(description ="Encrypt Password of all users" )
	public ResponseEntity<?> encryptUserPassword() {
		log.info("encrypting users password ");
		//invoke service layer method
		return ResponseEntity.ok(userService.encryptPasswords());

	}

}
