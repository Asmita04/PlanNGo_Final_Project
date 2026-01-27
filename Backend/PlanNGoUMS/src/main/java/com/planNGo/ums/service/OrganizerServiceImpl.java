package com.planNGo.ums.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.entities.Organizer;
import com.planNGo.ums.entities.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service // spring bean - B.L
@Transactional // auto tx management
@RequiredArgsConstructor
@Slf4j
public class OrganizerServiceImpl implements OrganizerService {


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
	public User getOrganizerDetails(Long userId) {
		// TODO Auto-generated method stub
		return null;
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
