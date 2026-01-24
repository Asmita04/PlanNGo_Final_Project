package com.planNGo.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
	    exclude = {
	        org.springframework.boot.autoconfigure.security.reactive.ReactiveUserDetailsServiceAutoConfiguration.class
	    }
	)
public class PlanNGoApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlanNGoApiGatewayApplication.class, args);
	}

}
