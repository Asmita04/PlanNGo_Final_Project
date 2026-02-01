package com.planngo.ticketservice.service;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.planngo.ticketservice.dto.*;
import com.planngo.ticketservice.model.EventTicket;
import com.planngo.ticketservice.model.TicketType;

import com.planngo.ticketservice.repository.EventTicketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventTicketServiceImpl implements EventTicketService {
	private final EventTicketRepository repository;

    @Override
    public List<EventTicketResponseDTO> create(EventTicketRequestDTO dto) {

        List<EventTicket> entities = dto.getTickets().stream()
                .map(ticket -> (EventTicket.builder()
                        .eventId(dto.getEventId())
                        .typeName(TicketType.valueOf(ticket.getTicketType())) // ✅ FIX
                        .price(ticket.getPrice())
                        .totalQuantity(ticket.getTotalQuantity())
                        .build()
                ))
                .collect(Collectors.toList());

        List<EventTicket> saved = repository.saveAll(entities);

        return saved.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    @Override
    public List<EventTicketResponseDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventTicketResponseDTO getById(Integer id) {
        EventTicket entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        return mapToDTO(entity);
    }

//    @Override
//    public EventTicketResponseDTO update(Integer id, TicketRequest ticketDto) {
//
//        EventTicket entity = repository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Ticket not found"));
//
//        entity.setTypeName(TicketType.valueOf(ticketDto.getTicketType()));
//        entity.setPrice(ticketDto.getPrice());
//        entity.setTotalQuantity(ticketDto.getTotalQuantity());
//
//        return mapToDTO(repository.save(entity));
//    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    private EventTicketResponseDTO mapToDTO(EventTicket e) {
        return EventTicketResponseDTO.builder()
                .ticketTypeId(e.getTicketTypeId())
                .eventId(e.getEventId())
                .typeName(e.getTypeName())
                .price(e.getPrice())
                .totalQuantity(e.getTotalQuantity())
                .build();
    }
}
