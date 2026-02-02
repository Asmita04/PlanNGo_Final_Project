package com.planNGo.ums.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.dtos.AuthRequest;
import com.planNGo.ums.dtos.AuthResp;
import com.planNGo.ums.dtos.UpdateCustomer;
import com.planNGo.ums.dtos.UpdateOrganizer;
import com.planNGo.ums.dtos.UserDTO;
import com.planNGo.ums.dtos.UserRegDTO;
import com.planNGo.ums.entities.User;

public interface UserService {
//get all users
	List<UserDTO> getAllUsers();

	String addUser(User user);

	ApiResponse deleteUserDetails(Long userId);

	User getUserDetails(Long userId);

	ApiResponse updateCustomerDetails(Long id, UpdateCustomer customer);
	
	ApiResponse updateOrganizerDetails(Long userId, UpdateOrganizer organizerDTO);

	//AuthResp googleSignIn(OAuth2UserRequest userRequest);
	
	ApiResponse register(UserRegDTO dto);
	
	AuthResp authenticate(AuthRequest request);
	
	ApiResponse encryptPasswords();

	ApiResponse uploadPfp(Long id, MultipartFile file);

	
}
