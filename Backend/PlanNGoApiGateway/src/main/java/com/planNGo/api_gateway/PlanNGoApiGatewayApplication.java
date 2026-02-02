package com.planNGo.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication(
	    exclude = {
	        org.springframework.boot.autoconfigure.security.reactive.ReactiveUserDetailsServiceAutoConfiguration.class
	    }
	)
@EnableEurekaClient
public class PlanNGoApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlanNGoApiGatewayApplication.class, args);
	}

}
