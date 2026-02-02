package com.planNGo.ums.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.planNGo.ums.custom_exceptions.ResourceNotFoundException;
import com.planNGo.ums.dtos.ApiResponse;
import com.planNGo.ums.dtos.OrganizerDTO;
import com.planNGo.ums.dtos.UserDTO;
import com.planNGo.ums.entities.Customer;
import com.planNGo.ums.entities.Document;
import com.planNGo.ums.entities.Organizer;
import com.planNGo.ums.entities.User;
import com.planNGo.ums.repository.CustomerRepository;
import com.planNGo.ums.repository.DocumentRepository;
import com.planNGo.ums.repository.OrganizerRepository;
import com.planNGo.ums.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service // spring bean - B.L
@Transactional // auto tx management
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {
	private final OrganizerRepository organizerRepository;
	private final CustomerRepository customerRepository;
	private final UserRepository userRepository;
	private final DocumentRepository documentRepository;
	private final DocumentService documentService;
	
	@Override
	public ApiResponse verifyOrganizer(Long userId) {
		User user =userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Invalid user id !!!!!"));
			
			Organizer organizer = organizerRepository.findByUserDetails(user)
					.orElseThrow(() -> new ResourceNotFoundException("Invalid user id !!!!!"));
			
			organizer.setIsVerified(true);
			
			organizerRepository.save(organizer);
			
			return new ApiResponse("Success","Organizer Verified");

	}
	
	@Override
	public ApiResponse unVerifyOrganizer(Long id) {
		User user =userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Invalid user id !!!!!"));
			
			Organizer organizer = organizerRepository.findByUserDetails(user)
					.orElseThrow(() -> new ResourceNotFoundException("Invalid user id !!!!!"));
			
			organizer.setIsVerified(false);
			
			organizerRepository.save(organizer);
			
			return new ApiResponse("Success","Organizer UnVerified");
	}

	@Override
	public List<OrganizerDTO> getAllOrganizers() {
		
		return organizerRepository.findAll().stream()
				.map(organizer ->new OrganizerDTO(organizer.getUserDetails().getId(),
						organizer.getUserDetails().getFirstName(),
						organizer.getUserDetails().getLastName(),
						organizer.getUserDetails().getEmail(),
						organizer.getOrganization()
						)).toList();
		
	}

	@Override
	public List<UserDTO> getAllUsers() {
		List<Customer> customers= customerRepository.findAll();
		List<Organizer> organizers= organizerRepository.findAll();
		
		List<UserDTO> customerDtos = customers.stream()
		        .map(UserDTO::fromCustomer)
		        .toList();
		
		List<UserDTO> organizerDtos = organizers.stream()
		        .map(UserDTO::fromOrganizer)
		        .toList();
		
		List<UserDTO> userDtos =
		        Stream.concat(customerDtos.stream(), organizerDtos.stream())
		              .toList();
				
		
		return userDtos;
	}

	
	@GetMapping("/documents/{userId}")
	public ResponseEntity<?> getOrganizerDocuments(@PathVariable Long userId) {

	    List<Document> files = documentRepository.findAllByUserDetails_Id(userId);

	    return ResponseEntity.ok(
	            files.stream()
	                    .map(file -> Map.of(
	                            "fileId", file.getId(),
	                            "docType", file.getDocumentsType().getDocumentType(),
	                            "downloadUrl", documentService.generateDownloadUrl(file.getS3Key())
	                    ))
	                    .toList()
	    );
	}

	

}
