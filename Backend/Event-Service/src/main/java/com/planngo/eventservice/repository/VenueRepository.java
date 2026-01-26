package com.planngo.eventservice.repository;

import com.planngo.eventservice.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository extends JpaRepository<Venue,Integer> {
}
