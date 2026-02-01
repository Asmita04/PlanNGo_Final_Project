package com.planngo.ticketservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.planngo.ticketservice.model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {
}