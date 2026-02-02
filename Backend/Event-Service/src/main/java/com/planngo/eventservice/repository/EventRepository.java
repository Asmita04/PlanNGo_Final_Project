package com.planngo.eventservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planngo.eventservice.model.Event;

public interface EventRepository extends JpaRepository<Event,Integer>{
	
}
