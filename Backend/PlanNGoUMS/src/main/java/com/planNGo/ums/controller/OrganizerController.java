package com.planNGo.ums.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planNGo.ums.dtos.OrganizerResp;
import com.planNGo.ums.entities.Organizer;
import com.planNGo.ums.service.OrganizerService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController //= @Controller + @ResponseBody
@RequestMapping("/organizer")  //base url-pattern
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor //Creates a parameterized ctor having final & non null fields
@Validated
@Slf4j
public class OrganizerController {
	//depcy 	
	private final OrganizerService 	organizerService;
	

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
	
	
	
	
	@GetMapping("/{organizerId}")
	public ResponseEntity<OrganizerResp> getOrganizerDetails(@PathVariable Long organizerId) {
		System.out.println("in get organizer details "+organizerId);
	
			return ResponseEntity.ok(
					organizerService.getOrganizerDetails(organizerId));
		
	}
	
	@PutMapping("/{id}")
	//swagger annotation - use till testing phase
	@Operation(description ="Complete Update organizer details")
	public ResponseEntity<?> updateUserDetails(@PathVariable Long id,@RequestBody Organizer organizer) {
		System.out.println("in update "+id+" "+organizer);
	
			return ResponseEntity.ok(organizerService.updateDetails(id,organizer)
					);
		
	}


	


}
