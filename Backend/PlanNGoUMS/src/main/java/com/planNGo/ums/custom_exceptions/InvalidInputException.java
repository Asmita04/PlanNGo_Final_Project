package com.planNGo.ums.custom_exceptions;

@SuppressWarnings("serial")
public class InvalidInputException extends RuntimeException {
	public InvalidInputException(String message) {
		super(message);
	}
}
