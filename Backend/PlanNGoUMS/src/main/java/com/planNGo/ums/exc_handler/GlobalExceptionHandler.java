package com.planNGo.ums.exc_handler;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.planNGo.ums.custom_exceptions.ResourceNotFoundException;
import com.planNGo.ums.dtos.ApiResponse;



@RestControllerAdvice
/*
						 * = @ControllerAdvice - class level annotation + @ResponseBody implicitly added
						 * on all exception handling methods. Use @ControllerAdvice - in MVC controller
						 * Use @RestControllerAdvice - in RESTful web service - Declares a spring bean -
						 * containing global exc handling advice (GlobalExceptionHandler is giving a
						 * common advice to all rest controllers - You don't add recurring exc handling
						 * logic (try-catch) - I will supply it for you ! - Based on interceptor (proxy
						 * - Middleware - Node) pattern
						 * 
						 */
public class GlobalExceptionHandler {
	/*
	 * To declare exc handling method - add method level annotation
	 */
	// catch-all
	@ExceptionHandler(Exception.class)
	// @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR )
	public ResponseEntity<?> handleException(Exception e) {
		System.out.println("in catch all ");
//			return ResponseEntity/* .status(HttpStatus.INTERNAL_SERVER_ERROR) */
//				 .of(Optional.of(new ApiResponse("Failed", e.getMessage())));
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse("Failed", e.getMessage()));
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException e) {
		System.out.println("in catch - ResourceNotFoundException");
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Failed", e.getMessage()));
	}	

	/*
	 * To handle - MethodArgNotValid - Trigger - @Valid
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
		System.out.println("in catch - MethodArgumentNotValidException");
		// 1. Get List of rejected fields
		List<FieldError> list = e.getFieldErrors();
		// 2. Convert list of FieldErrors -> Map<Key - field name , Value - err mesg>
		/*
		 * Map<String, String> map=new HashMap<>(); for(FieldError field : list)
		 * map.put(field.getField(), field.getDefaultMessage());
		 * 
		 * return ResponseEntity.status(HttpStatus.BAD_REQUEST) .body(map);
		 */

		Map<String, String> map = list.stream()
				.collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage,(v1,v2) -> v1+" "+v2));
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(map);
	}
	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<?> handleAuthenticationException(AuthenticationException e) {
		System.out.println("in catch -Spring sec detected  Authentication Exception "+e);
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse("Failed", e.getMessage()));
	}


}
