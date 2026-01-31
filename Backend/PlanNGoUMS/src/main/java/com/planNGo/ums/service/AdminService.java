package com.planNGo.ums.service;

import java.util.List;

import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.dtos.OrganizerDTO;
import com.planNGo.ums.dtos.UserDTO;

public interface AdminService {
	ApiResponse verifyOrganizer(Long id);

	List<OrganizerDTO> getAllOrganizers();

	List<UserDTO> getAllUsers();

	ApiResponse unVerifyOrganizer(Long id);
}
