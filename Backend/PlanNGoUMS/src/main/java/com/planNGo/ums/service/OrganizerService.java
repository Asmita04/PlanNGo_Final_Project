package com.planNGo.ums.service;

import java.util.List;

import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.dtos.OrganizerDTO;
import com.planNGo.ums.dtos.OrganizerResp;
import com.planNGo.ums.dtos.UpdateOrganizer;
import com.planNGo.ums.entities.Organizer;

public interface OrganizerService {
//get all users
	//List<OrganizerDTO> getAllOrganizers();
	
	

	ApiResponse deleteOrganizer(Long organizerId);

	OrganizerResp getOrganizerDetails(Long organizerId);

	ApiResponse updateDetails(Long id, UpdateOrganizer organizer);

	
	
	
	
}
