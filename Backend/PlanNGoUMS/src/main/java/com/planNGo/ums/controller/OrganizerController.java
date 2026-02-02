package com.planNGo.ums.controller;


import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.planNGo.ums.dtos.OrganizerResp;
import com.planNGo.ums.dtos.UpdateOrganizer;
import com.planNGo.ums.repository.DocumentRepository;
import com.planNGo.ums.service.OrganizerService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController //= @Controller + @ResponseBody
@RequestMapping("/organizer")  //base url-pattern

@RequiredArgsConstructor //Creates a parameterized ctor having final & non null fields
@Validated
@Slf4j
public class OrganizerController {
	//depcy 	
	private final OrganizerService 	organizerService;
	private final DocumentRepository repository;

//	@GetMapping
//	public /* @ResponseBody */  ResponseEntity<?> renderOrgainzerList() {
//		System.out.println("in render user list");
//		List<OrganizerDTO> list = organizerService.getAllOrganizers();
//		if(list.isEmpty())
//			return ResponseEntity.status(HttpStatus.NO_CONTENT)
//					.build(); //only status code : 204
//		//=> non empty body
//		return ResponseEntity.ok(list); //SC 200 + List -> Json[]
//	}

	// Feign will call THIS
	@GetMapping("/status/{userId}")
	public ResponseEntity<OrganizerResp> getOrganizerStatus(@PathVariable Long userId) {

		OrganizerResp resp = organizerService.getOrganizerDetails(userId);

		return ResponseEntity.ok(
				OrganizerResp.builder()
						.organizerId(resp.getOrganizerId())
						.isVerified(resp.getIsVerified())
						.build()
		);
	}



	@GetMapping("/{organizerId}")
	public ResponseEntity<OrganizerResp> getOrganizerDetails(@PathVariable Long organizerId) {
		System.out.println("in get organizer details "+organizerId);
	
			return ResponseEntity.ok(
					organizerService.getOrganizerDetails(organizerId));
		
	}
	


	@PutMapping("/profile/{userId}")
	//swagger annotation - use till testing phase
	@Operation(description ="Complete Update organizer details")
	public ResponseEntity<?> updateOrganizerDetails(@PathVariable Long userId,@RequestBody UpdateOrganizer user) {
		log.info("***** in organizer update{} ",user);

		System.out.println("in update "+userId+" "+user);
		
			return ResponseEntity.ok(organizerService.updateDetails(userId,user));
		
	}
	
	
	
    @PostMapping("/documents/{userId}")
    public ResponseEntity<?> uploadDocuments(
            @PathVariable Long userId,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam String[] docType) throws IOException {

        

        return ResponseEntity.ok(organizerService.uploadDocuments(userId, files, docType));
    }
	


}
