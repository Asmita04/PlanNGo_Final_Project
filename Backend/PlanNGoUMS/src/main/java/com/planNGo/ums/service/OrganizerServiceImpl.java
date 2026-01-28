package com.planNGo.ums.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planNGo.ums.custom_exceptions.ResourceNotFoundException;
import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.dtos.OrganizerResp;
import com.planNGo.ums.dtos.UpdateOrganizer;
import com.planNGo.ums.entities.Organizer;
import com.planNGo.ums.entities.User;
import com.planNGo.ums.repository.OrganizerRepository;
import com.planNGo.ums.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service // spring bean - B.L
@Transactional // auto tx management
@RequiredArgsConstructor
@Slf4j
public class OrganizerServiceImpl implements OrganizerService {
	private final OrganizerRepository organizerRepository;
	private final UserRepository userRepository;
	

	@Override
	public ApiResponse deleteOrganizer(Long organizerId) {
		Organizer organizer =organizerRepository.findById(organizerId)
			.orElseThrow(() -> new ResourceNotFoundException("Invalid user id !!!!!"));
		
		User user =organizer.getUserDetails();
		user.setIsActive(false);
		
		userRepository.save(user);
		
		return new ApiResponse("Success","User Deactivated");
	}

	@Override
	public OrganizerResp getOrganizerDetails(Long userId) {

		Organizer organizer = organizerRepository
				.findByUserDetails_Id(userId)
				.orElseThrow(() ->
						new ResourceNotFoundException("Organizer not found for user id: " + userId)
				);

		return OrganizerResp.fromOrganizer(organizer);
	}


	@Override
	public ApiResponse updateDetails(Long id, UpdateOrganizer user) {
		// 1. get user details by id
				User persistentUser=userRepository.findById(id)
						.orElseThrow(() -> new ResourceNotFoundException("Invalid user id !!!!!"));
				//2 . call setters

				persistentUser.setFirstName(user.firstName());
				persistentUser.setLastName(user.lastName());
				persistentUser.setBio(user.bio());
				persistentUser.setPhone(user.phone());
				persistentUser.setPfp(user.pfp());
				persistentUser.setAddress(user.address());
				
				
				Organizer organizer= organizerRepository.findByUserDetails(persistentUser)
						.orElseThrow(() -> new ResourceNotFoundException("Invalid user!!!!!"));
				
				organizer.setOrganization(user.organization());
				
				
				userRepository.save(persistentUser);
				organizerRepository.save(organizer);
				
				//similarly call other setters		
				return new ApiResponse("Success", "Updated organizer details");
	}
	

//	@Override
//	public List<OrganizerDTO> getAllOrganizers() {
//		// TODO Auto-generated method stub
//		return null;
//	}

}
