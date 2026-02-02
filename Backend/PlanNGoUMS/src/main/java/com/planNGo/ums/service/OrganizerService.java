package com.planNGo.ums.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.dtos.OrganizerResp;
import com.planNGo.ums.dtos.UpdateOrganizer;

public interface OrganizerService {
//get all users
	//List<OrganizerDTO> getAllOrganizers();
	
	

	ApiResponse deleteOrganizer(Long organizerId);

	OrganizerResp getOrganizerDetails(Long organizerId);

	ApiResponse updateDetails(Long id, UpdateOrganizer organizer);

	

	ApiResponse uploadDocuments(Long userId, MultipartFile files, String docType);

	
	
	
	
}
