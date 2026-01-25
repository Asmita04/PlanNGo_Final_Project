package com.planNGo.api_gateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

import lombok.RequiredArgsConstructor;
//import static org.springframework.security.config.web.server.ServerHttpSecurity.

//Java configuration class
@Configuration
/*
 * Enables Spring Security WebFlux support to a Configuration class. Can then
 * create here ServerHttpSecurity Bean instance (equivalent to HttpSecurity)
 * Enables reactive Spring Security
 */
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	private final CustomJwtFilter customJwtFilter;

	@Bean
	SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

		return
		// Disable CSRF protection (stateless authentication)
		http.csrf(ServerHttpSecurity.CsrfSpec::disable)
				// Disable Basic Authentication
				.httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
				// Disable formLogin
				.formLogin(ServerHttpSecurity.FormLoginSpec::disable)

				.authorizeExchange(auth -> auth
						.pathMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html", "/webjars/**").permitAll()
						.pathMatchers(HttpMethod.GET, "/organizers", "/demo").permitAll()
						.pathMatchers("/users/signin", "/organizers/signup", "/customer/signup").permitAll() 
						// UMS																						// login/register
						.pathMatchers(HttpMethod.GET, "/customer", "/users", "/bookings", "/bookings/*").hasRole("ADMIN")

						.pathMatchers(HttpMethod.POST, "/bookings").hasRole("CUSTOMER")

						.pathMatchers(HttpMethod.PATCH, "/bookings").hasRole("CUSTOMER")

						.pathMatchers(HttpMethod.GET, "/customers/*", "/bookings/customers/**").hasAnyRole("ADMIN", "CUSTOMER")

						.pathMatchers(HttpMethod.GET, "/organizers/*", "/bookings/organizers/**").hasAnyRole("ADMIN", "ORGANIZER")

						// authenticate any other remaining request
						.anyExchange().authenticated())

				.addFilterAt(customJwtFilter, SecurityWebFiltersOrder.AUTHENTICATION).build();
	}
}
