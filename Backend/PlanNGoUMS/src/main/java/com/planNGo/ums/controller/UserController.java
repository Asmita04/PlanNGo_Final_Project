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
import org.springframework.web.bind.annotation.RestController;

import com.planNGo.ums.dtos.AuthRequest;
import com.planNGo.ums.dtos.UserDTO;
import com.planNGo.ums.entities.User;
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
	
	/*
	 * 1. Get All Users (get resource - readonly)
URI (path) - /users
Method - GET
Payload - none
Resp - SC 200 + List<UserDTO> - if list is not empty
user details - user id , name , dob , role , reg amount
 In case of empty list -       SC 204 , no body
	 */
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
	/*
	 * Handler (RestController) -> rets @ResponseBody List<User> 
	 * -> D.S
	 * -> Spring boot chooses default vendor for HttpMessageConverter
	 *  -> jackson perform serialization java-> json -> sent to REST client
	 *  
	 */
		/*
	 * Get existing user details By Id(from the back end) : GET
URI - /users/{userId}
Method - GET
Success Resp -  SC 200 + User details

Failure Resp - SC 404  + ApiResponse (DTO)
 - time stamp , status - failed , message - error mesg - user not found !!!!
Hint - Use findById

	 */
	@GetMapping("/{userId}")
	public ResponseEntity<?> getUserDetails(@PathVariable  @Min(1) @Max(100) Long userId) {
		System.out.println("in get user details "+userId);
	
			return ResponseEntity.ok(
					userService.getUserDetails(userId));
		
	}
	/*
	 * Desc -Complete Update user details
	 * URI - /users/{id}
	 * Payload - request body - user details to be updated
	 * Success - SC 200 + ApiResp 
	 * Failed - SC 400
	 */
	@PutMapping("/{id}")
	//swagger annotation - use till testing phase
	@Operation(description ="Complete Update user details")
	public ResponseEntity<?> updateUserDetails(@PathVariable Long id,@RequestBody User user) {
		System.out.println("in update "+id+" "+user);
	
			return ResponseEntity.ok(userService.updateDetails(id,user)
					);
		
	}
	/*
	 * 2. Patient Login / Doctor Login(User Login)  common

URL - http://host:port/users/signin
Method - POST  (for security , JWT generation, JSON payload)
Eg . Patient Logs in 
Payload - email , password  
Success Resp -Sc 200 |201  Auth Resp (JWT , message)
Failure Resp - SC 401 ApiResp DTO(status :  failure , timestamp , message)

	 */
	@PostMapping("/signin")
	@Operation(description = "User Login")
	public ResponseEntity<?> userSignIn(@RequestBody @Valid  AuthRequest request) {
		log.info("***** in user sign in {} ",request);		
			return ResponseEntity.ok(userService.authenticate(request));		
	}
	/*
	 * Encrypt Password of all users	  
	 * o/p -ApiResp (encrypted!) 
	 * DB Action - store  encrypted password in the DB 
	 * URL -http://host:port/users/pwd-encryption 
	 * Method - PATCH
	 */
	@PatchMapping("/pwd-encryption")
	@Operation(description ="Encrypt Password of all users" )
	public ResponseEntity<?> encryptUserPassword() {
		log.info("encrypting users password ");
		//invoke service layer method
		return ResponseEntity.ok(userService.encryptPasswords());

	}

}
