package com.planngo.ticketservice.repository;

import com.planngo.ticketservice.model.EventTicket;
import com.planngo.ticketservice.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventTicketRepository extends JpaRepository<EventTicket, Integer> {

	    /**
	     * Finds the specific inventory and price record for a given event and ticket type.
	     * This is used to calculate totals and verify stock before booking.
	     */
	    Optional<EventTicket> findByEventIdAndTypeName(Integer eventId, TicketType typeName);
}
