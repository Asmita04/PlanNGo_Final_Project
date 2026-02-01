package com.planngo.ticketservice.service;
import java.util.List;
import com.planngo.ticketservice.dto.*;
public interface EventTicketService {
	EventTicketResponseDTO create(EventTicketRequestDTO dto);
    List<EventTicketResponseDTO> getAll();
    EventTicketResponseDTO getById(Integer id);
    EventTicketResponseDTO update(Integer id, EventTicketRequestDTO dto);
    void delete(Integer id);
}
