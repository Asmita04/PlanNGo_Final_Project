package com.planngo.ticketservice.service;
import java.util.List;
import com.planngo.ticketservice.dto.*;
public interface EventTicketService {
	List<EventTicketResponseDTO> create(EventTicketRequestDTO dto);
    List<EventTicketResponseDTO> getAll();
    EventTicketResponseDTO getById(Integer id);
//    EventTicketResponseDTO update(Integer id, TicketRequest ticketDto);
    // ✅ new

    void delete(Integer id);
}
