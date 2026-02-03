package com.planngo.ticketservice.service;
import java.util.List;
import com.planngo.ticketservice.dto.*;
public interface EventTicketService {
	List<EventTicketResponseDTO> create(EventTicketRequestDTO dto);
    List<EventTicketResponseDTO> getAll();
    EventTicketResponseDTO getById(Integer id);

    void delete(Integer id);

    Double getPriceForTicketType(Integer eventId, String ticketType);
	List<EventTicketResponseDTO> getByEventId(Integer eventId);

}
