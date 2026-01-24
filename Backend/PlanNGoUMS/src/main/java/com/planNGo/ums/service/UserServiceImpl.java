package com.planNGo.ums.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planNGo.ums.custom_exceptions.InvalidInputException;
import com.planNGo.ums.custom_exceptions.ResourceNotFoundException;
import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.dtos.AuthRequest;
import com.planNGo.ums.dtos.AuthResp;
import com.planNGo.ums.dtos.UserDTO;
import com.planNGo.ums.entities.User;
import com.planNGo.ums.repository.UserRepository;
import com.planNGo.ums.security.JwtUtils;
import com.planNGo.ums.security.UserPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service // spring bean - B.L
@Transactional // auto tx management
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
	// depcy - Constructor based D.I	
	private final UserRepository userRepository;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtUtils jwtUtils;

	@Override
	public List<UserDTO> getAllUsers() {
		
		return userRepository.findAll() //List<Entity>
				.stream() //Stream<Entity>
				.map(entity -> modelMapper.map(entity, UserDTO.class)) //Stream<DTO>
				.toList();
	}

	@Override
	public String addUser(User user) {
		// 1. validate for dup email or phone no
		if (userRepository.existsByEmailOrPhone(user.getEmail(), user.getPhone())) {
			//dup email or phone no -> throw custom unchecked exception
			throw new InvalidInputException("Dup email or phone !!!!!!!!");
		}
		//2. save user details
		User persistentUser = userRepository.save(user);		
		return "New User added with ID="+persistentUser.getId();
	}//tx.commit() -> session.flush() -> DML - insert -> session.close()

	@Override
	public ApiResponse deleteUserDetails(Long userId) {
		//1. check if user exists by id
		if(userRepository.existsById(userId)) {
			//=> user exists -> mark it for removal
			userRepository.deleteById(userId);
			return new ApiResponse("Success", "User details deleted ....");
		}
		//user doesn't exist
		throw new ResourceNotFoundException("User doesn't exist by id !!!!!");
	}//deletes rec from DB

	@Override
	public User getUserDetails(Long userId) {
		// TODO Auto-generated method stub
		return userRepository.findById(userId) //Optional<User>
				.orElseThrow(() -> new ResourceNotFoundException("Invalid user id !!!!!"));
	}

	@Override
	public ApiResponse updateDetails(Long id, User user) {
		// 1. get user details by id
		User persistentUser=getUserDetails(id);
		//2 . call setters
		persistentUser.setDob(user.getDob());
		persistentUser.setFirstName(user.getFirstName());
		persistentUser.setLastName(user.getLastName());
		persistentUser.setPassword(user.getPassword());
		persistentUser.setRegAmount(user.getRegAmount());
		//similarly call other setters		
		return new ApiResponse("Success", "Updated user details");
	}

	@Override
	public AuthResp authenticate(AuthRequest request) {
		System.out.println("in user sign in "+request);		
		/*1. Create Authentication object (UsernamePasswordAuthToken) 
		 * to store - email & password
		 */
		Authentication holder=new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
		log.info("*****Before -  is authenticated {}",holder.isAuthenticated());//false
		/*
		 * Call AuthenticationMgr's authenticate method
		 */
		 Authentication fullyAuth = authenticationManager.authenticate(holder);
		//=> authentication success -> create JWT 
		log.info("*****After -  is authenticated {}",fullyAuth.isAuthenticated());//true
		log.info("**** auth {} ",fullyAuth);//principal : user details , null : pwd , Collection<GrantedAuth>		
		log.info("***** class of principal {}",fullyAuth.getPrincipal().getClass());//com.healthcare.security.UserPrincipal
		//downcast Object -> UserPrincipal
		UserPrincipal principal=(UserPrincipal) fullyAuth.getPrincipal();
			return new AuthResp(jwtUtils.generateToken(principal),"Successful Login");		
	
	}
	
	@Override
	public ApiResponse encryptPasswords() {
		//get all users
		List<User> users = userRepository.findAll();	
		//user - persistent
		users.forEach(user ->
		 user.setPassword(passwordEncoder.encode(user.getPassword())));
		return new ApiResponse("Password encrypted", "Success");
	}
	

}
