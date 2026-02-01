package com.planngo.ticketservice.dto;
import com.planngo.ticketservice.model.TicketType;
import java.time.LocalDateTime;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class TicketResponseDTO {
	    private Integer ticketId;
	    private Integer eventId;
	    private Integer customerId;
	    private Integer count;
	    private Double price;
	    private String status;
	    private LocalDateTime createdAt;
	    
	    private TicketType ticketType;
}
