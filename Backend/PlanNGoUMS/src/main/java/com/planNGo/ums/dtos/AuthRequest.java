package com.planNGo.ums.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AuthRequest {
	@NotBlank(message = "Email is required!")
	@Email(message = "Invalid Email Format")
	private String email;
	@NotBlank
	//@Pattern(regexp="((?=.*\\d)(?=.*[a-z])(?=.*[#@$*]).{5,20})",message = "Blank or invalid password")
	private String password;
}
