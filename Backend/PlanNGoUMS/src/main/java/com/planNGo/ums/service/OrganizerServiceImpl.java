package com.planNGo.ums.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.dtos.OrganizerDTO;
import com.planNGo.ums.dtos.UserDTO;
import com.planNGo.ums.entities.Organizer;
import com.planNGo.ums.entities.User;
import com.planNGo.ums.repository.CustomerRepository;
import com.planNGo.ums.repository.OrganizerRepository;
import com.planNGo.ums.repository.UserRepository;
import com.planNGo.ums.security.JwtUtils;

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

	@Override
	public List<OrganizerDTO> getAllOrganizers() {
		// TODO Auto-generated method stub
		return null;
	}

}
