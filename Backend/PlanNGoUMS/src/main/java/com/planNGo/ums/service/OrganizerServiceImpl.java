package com.planNGo.ums.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planNGo.ums.custom_exceptions.ResourceNotFoundException;
import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.dtos.OrganizerResp;
import com.planNGo.ums.entities.Organizer;
import com.planNGo.ums.entities.User;
import com.planNGo.ums.repository.OrganizerRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service // spring bean - B.L
@Transactional // auto tx management
@RequiredArgsConstructor
@Slf4j
public class OrganizerServiceImpl implements OrganizerService {
	private final OrganizerRepository organizerRepository;

	@Override
	public String addOrganizer(User user) {
		// TODO Auto-generated method stub
		return "";
	}

	@Override
	public ApiResponse deleteOrganizerDetails(Long userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public OrganizerResp getOrganizerDetails(Long organizerId) {
	    Organizer organizer=organizerRepository.findById(organizerId)
	    		.orElseThrow(() -> new ResourceNotFoundException("Invalid user id !!!!!"));
	    
	    
		return OrganizerResp.fromOrganizer(organizer);
	}

	@Override
	public ApiResponse updateDetails(Long id, Organizer organizer) {
		// TODO Auto-generated method stub
		return null;
	}

//	@Override
//	public List<OrganizerDTO> getAllOrganizers() {
//		// TODO Auto-generated method stub
//		return null;
//	}

}
