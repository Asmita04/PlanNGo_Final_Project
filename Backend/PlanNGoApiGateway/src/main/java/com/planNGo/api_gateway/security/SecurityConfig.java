package com.planNGo.api_gateway.security;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomJwtFilter customJwtFilter;

    @Bean
    SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

        return http
                // ✅ Enable CORS (Spring Security 6 – non-deprecated)
                .cors(withDefaults())

                // ✅ Stateless API
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)

                // ✅ Authorization rules
                .authorizeExchange(auth -> auth

                        // 🔹 CORS preflight
                        //.pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 🔹 Swagger / OpenAPI
                        .pathMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/webjars/**"
                        ).permitAll()

                        // 🔹 Public endpoints
                        .pathMatchers(HttpMethod.GET, "/organizers", "/demo").permitAll()
                        .pathMatchers(
                                "/users/signin",
                                "/organizers/signup",
                                "/customer/signup"
                        ).permitAll()

                        // 🔹 ADMIN only
                        .pathMatchers(HttpMethod.GET,
                                "/customer",
                                "/users",
                                "/bookings",
                                "/bookings/*"
                        ).hasRole("ADMIN")

                        // 🔹 CUSTOMER only
                        .pathMatchers(HttpMethod.POST, "/bookings").hasRole("CUSTOMER")
                        .pathMatchers(HttpMethod.PATCH, "/bookings").hasRole("CUSTOMER")

                        // 🔹 ADMIN or CUSTOMER
                        .pathMatchers(HttpMethod.GET,
                                "/customers/*",
                                "/bookings/customers/**"
                        ).hasAnyRole("ADMIN", "CUSTOMER")

                        // 🔹 ADMIN or ORGANIZER
                        .pathMatchers(HttpMethod.GET,
                                "/organizers/*",
                                "/bookings/organizers/**"
                        ).hasAnyRole("ADMIN", "ORGANIZER")

                        // 🔹 Everything else requires authentication
                        .anyExchange().authenticated()
                )

                // ✅ JWT filter at authentication phase
                .addFilterAt(customJwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)

                .build();
    }
}
