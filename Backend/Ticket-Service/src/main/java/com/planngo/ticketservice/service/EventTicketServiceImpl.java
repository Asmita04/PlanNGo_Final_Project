package com.planngo.ticketservice.service;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.planngo.ticketservice.dto.*;
import com.planngo.ticketservice.model.EventTicket;
import com.planngo.ticketservice.repository.EventTicketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventTicketServiceImpl implements EventTicketService {
	private final EventTicketRepository repository;

    @Override
    public EventTicketResponseDTO create(EventTicketRequestDTO dto) {
        EventTicket entity = EventTicket.builder()
                .eventId(dto.getEventId())
                .typeName(dto.getTypeName())
                .price(dto.getPrice())
                .totalQuantity(dto.getTotalQuantity())
                .build();

        EventTicket saved = repository.save(entity);
        return mapToDTO(saved);
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

    @Override
    public EventTicketResponseDTO update(Integer id, EventTicketRequestDTO dto) {
        EventTicket entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        entity.setPrice(dto.getPrice());
        entity.setTotalQuantity(dto.getTotalQuantity());
        entity.setTypeName(dto.getTypeName());

        return mapToDTO(repository.save(entity));
    }

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
