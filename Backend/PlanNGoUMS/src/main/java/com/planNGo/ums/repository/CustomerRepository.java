package com.planNGo.ums.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planNGo.ums.entities.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}
