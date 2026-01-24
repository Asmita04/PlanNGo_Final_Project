package com.planNGo.ums.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planNGo.ums.dtos.ApiResponse;

@RestController
@RequestMapping("/demo")
@RefreshScope
public class RefreshDemoController {
	@Value("${test.message}")
	private String testMessage;
	@GetMapping
	public ResponseEntity<?> getMessage() {
		return ResponseEntity.ok(new ApiResponse("Success", testMessage));
	}
}
