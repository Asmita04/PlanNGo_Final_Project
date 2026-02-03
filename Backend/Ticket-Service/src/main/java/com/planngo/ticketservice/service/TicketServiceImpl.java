package com.planngo.ticketservice.service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.planngo.ticketservice.client.EventClient;
import com.planngo.ticketservice.dto.EventResponse;
import com.planngo.ticketservice.dto.TicketRequestDTO;
import com.planngo.ticketservice.dto.TicketResponseDTO;
import com.planngo.ticketservice.model.EventTicket;
import com.planngo.ticketservice.model.Ticket;
import com.planngo.ticketservice.model.TicketStatus;
import com.planngo.ticketservice.repository.EventTicketRepository;
import com.planngo.ticketservice.repository.TicketRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {
	
	private final TicketRepository ticketRepository;
	private final EventTicketRepository eventTicketRepository;
	private final EventClient eventClient;

	@Override
	@Transactional
	public TicketResponseDTO bookTicket(TicketRequestDTO request) {
		 EventResponse event = eventClient.getEventById(request.getEventId());

		    if (event.getIsExpired()) {
		        throw new RuntimeException("Event is expired. Booking not allowed.");
		    }

		    if (!event.getIsApproved()) {
		        throw new RuntimeException("Event is not approved yet.");
		    }
		
		
		
		EventTicket inventory=eventTicketRepository.findByEventIdAndTypeName(request.getEventId(), request.getTicketType())
				.orElseThrow(() -> new RuntimeException("Ticket type not found for this event"));
		
		if (inventory.getTotalQuantity() < request.getCount()) {
			throw new RuntimeException("Not enough tickets available. Remaining: " + inventory.getTotalQuantity());
		}	
		
		Double totalCalculatedPrice = inventory.getPrice() * request.getCount();
		inventory.setTotalQuantity(inventory.getTotalQuantity() - request.getCount());
		
		eventTicketRepository.save(inventory);
		
		

	    Ticket ticket = Ticket.builder()
	            .customerId(request.getCustomerId())
	            .eventId(request.getEventId())
	            .ticketType(request.getTicketType())
	            .count(request.getCount())
				.status(TicketStatus.PENDING)
	            .createdAt(LocalDateTime.now())
	            .price(totalCalculatedPrice)
	            .build();

	    Ticket savedTicket = ticketRepository.save(ticket);

	    return TicketResponseDTO.builder()
	            .ticketId(savedTicket.getTicketId())
	            .customerId(savedTicket.getCustomerId())
	            .eventId(savedTicket.getEventId())
	            .ticketType(savedTicket.getTicketType())
	            .count(savedTicket.getCount())
	            .price(savedTicket.getPrice())
	            .status(savedTicket.getStatus().name())
	            .createdAt(savedTicket.getCreatedAt())
	            .build();
	}

	@Override
	public void cancelTicket(Integer ticketId) {
		Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
		
		EventTicket inventory = eventTicketRepository
				.findByEventIdAndTypeName(ticket.getEventId(), ticket.getTicketType())
				.orElseThrow(() -> new RuntimeException("Inventory record not found"));

		inventory.setTotalQuantity(inventory.getTotalQuantity() + ticket.getCount());
		eventTicketRepository.save(inventory);

        ticket.setStatus(TicketStatus.CANCELLED);
        ticketRepository.save(ticket);

	}

	@Override
	public List<TicketResponseDTO> getAllConfirmedTickets() {
		return ticketRepository.findByStatus("CONFIRMED")
				.stream()
				.map(this::mapToDTO)
				.collect(Collectors.toList());
	}

	private TicketResponseDTO mapToDTO(Ticket t) {
		return TicketResponseDTO.builder()
				.ticketId(t.getTicketId())
				.eventId(t.getEventId())
				.customerId(t.getCustomerId())
				.count(t.getCount())
				.price(t.getPrice())
				.status(String.valueOf(t.getStatus()))
				.createdAt(t.getCreatedAt())
				.build();
	}
}
