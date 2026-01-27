package com.planNGo.ums.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planNGo.ums.entities.User;
import com.planNGo.ums.entities.UserRole;

public interface UserRepository extends JpaRepository<User, Long> {

	

	

	int deleteByUserRole(UserRole role);

	
	 //check if user already exists by same email or phone
	 
	boolean existsByEmailOrPhone(String email,String phoneNo);
	// sign in
	
	Optional<User> findByEmailAndPassword(String email, String password);

	boolean existsByEmail(String email);

	Optional<User> findByEmail(String email);


	Optional<User> findByGoogleId(String googleId);
}
