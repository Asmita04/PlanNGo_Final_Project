package com.planNGo.ums.service;

import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.entities.Organizer;
import com.planNGo.ums.entities.User;

public interface OrganizerService {
//get all users
	//List<OrganizerDTO> getAllOrganizers();

	String addOrganizer(User user);

	ApiResponse deleteOrganizerDetails(Long organizerId);

	User getOrganizerDetails(Long userId);

	ApiResponse updateDetails(Long id, Organizer organizer);

	//AuthResp googleSignIn(OAuth2UserRequest userRequest);
	
	
}
