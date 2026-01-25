package com.planNGo.ums.dtos;

import java.time.LocalDate;

import org.hibernate.validator.constraints.Length;

import com.planNGo.ums.entities.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/*
 *  "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string",
    "phone": "string",
    "dob": "string",
    "regAmount": 0
 */
@Getter
@Setter
public class UserRegDTO {
	
	private String gooogleID;
	
	@NotBlank(message = "FirstName is required")
	@Size(min=3,max=20,message="first name must min 3 chars and max 20 chars")
	private String firstName;
	@NotBlank
	private String lastName;
	@NotBlank
	private String address;
	@NotBlank   @Email
	private String email;	
	@NotBlank
	@Pattern(regexp="((?=.*\\d)(?=.*[a-z])(?=.*[#@$*]).{5,20})")
	private String password;

	private String pfp;
	@NotBlank
	private UserRole role;

}
