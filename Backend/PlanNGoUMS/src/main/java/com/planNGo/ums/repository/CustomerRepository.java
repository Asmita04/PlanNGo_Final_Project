package com.planNGo.ums.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planNGo.ums.entities.Customer;
import com.planNGo.ums.entities.User;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
	Optional<Customer> findByUserDetails(User user);
}
