package com.planNGo.ums.service;

import java.util.List;

import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.dtos.AuthRequest;
import com.planNGo.ums.dtos.AuthResp;
import com.planNGo.ums.dtos.UserDTO;
import com.planNGo.ums.entities.User;

public interface UserService {
//get all users
	List<UserDTO> getAllUsers();

	String addUser(User user);

	ApiResponse deleteUserDetails(Long userId);

	User getUserDetails(Long userId);

	ApiResponse updateDetails(Long id, User user);

	AuthResp authenticate(AuthRequest request);
	ApiResponse encryptPasswords();
}
