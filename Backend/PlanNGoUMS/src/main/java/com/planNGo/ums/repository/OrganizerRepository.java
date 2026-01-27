package com.planNGo.ums.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planNGo.ums.entities.Organizer;
import com.planNGo.ums.entities.User;


public interface OrganizerRepository extends JpaRepository<Organizer, Long> {
	Optional<Organizer> findByUserDetails(User user);
}
