package com.planngo.ticketservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.planngo.ticketservice.model.Ticket;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    List<Ticket> findByStatus(String status);
}