package com.planNGo.ums.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planNGo.ums.custom_exceptions.InvalidInputException;
import com.planNGo.ums.custom_exceptions.ResourceNotFoundException;
import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.dtos.AuthRequest;
import com.planNGo.ums.dtos.AuthResp;
import com.planNGo.ums.dtos.UserDTO;
import com.planNGo.ums.dtos.UserRegDTO;
import com.planNGo.ums.entities.Customer;
import com.planNGo.ums.entities.Organizer;
import com.planNGo.ums.entities.User;
import com.planNGo.ums.entities.UserRole;
import com.planNGo.ums.repository.CustomerRepository;
import com.planNGo.ums.repository.OrganizerRepository;
import com.planNGo.ums.repository.UserRepository;
import com.planNGo.ums.security.JwtUtils;
import com.planNGo.ums.security.UserPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service // spring bean - B.L
@Transactional // auto tx management
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl extends DefaultOAuth2UserService  implements UserService {
	// depcy - Constructor based D.I	
	private final OrganizerRepository organizerRepository;
    private final CustomerRepository customerRepository;
	private final UserRepository userRepository;

	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtUtils jwtUtils;


	@Override
	public AuthResp authenticate(AuthRequest request) {
		System.out.println("in user sign in "+request);		
		/*1. Create Authentication object (UsernamePasswordAuthToken) 
		 * to store - email & password
		 */
		Authentication holder=new UsernamePasswordAuthenticationToken(request.email(), request.password());
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

	/*
	 * @Override public AuthResp googleSignIn(OAuth2UserRequest userRequest) throws
	 * OAuth2AuthenticationException {
	 * 
	 * OAuth2User oauthUser = super.loadUser(userRequest); User user = new User();
	 * String googleId = oauthUser.getAttribute("sub"); String email =
	 * oauthUser.getAttribute("email");
	 * 
	 * user=userRepository.findByGoogleId(googleId) .orElseGet(() -> {
	 * 
	 * user.setGoogleId(googleId); user.setEmail(email);
	 * 
	 * userRepository.save(user); });
	 * 
	 * UserPrincipal principal = UserPrincipal.fromUser(user);
	 * 
	 * 
	 * String jwt = jwtUtils.generateToken(principal); return new
	 * AuthResp(jwtUtils.generateToken(principal),"Successful Login"); }
	 */
	
	@Override
	public ApiResponse register(UserRegDTO dto) {
		
		User user= modelMapper.map(dto, User.class);
		
		
		
		if (userRepository.existsByEmailOrPhone(user.getEmail(), user.getPhone())) {
		
			throw new InvalidInputException("Dup email or phone !!!!!!!!");
		}
		user.setIsEmailVerified(false);
		if(user.getGoogleId()!=null)
			user.setIsEmailVerified(true);
		
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		
		userRepository.save(user);
		
		if(user.getUserRole().equals(UserRole.ROLE_CUSTOMER)) {
			Customer customer= new Customer();
			customer.setUserDetails(user);
			customerRepository.save(customer);
			
		}
		else if (user.getUserRole().equals(UserRole.ROLE_ORGANIZER)) {
			Organizer organizer= new Organizer();
			organizer.setUserDetails(user);
			organizer.setIsVerified(false);
			organizerRepository.save(organizer);
			
		}
		return new ApiResponse("Success", "User Registered Successfully ....");
	}
	
	
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
		
		//similarly call other setters		
		return new ApiResponse("Success", "Updated user details");
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
