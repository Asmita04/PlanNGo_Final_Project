package com.planngo.ticketservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_ticket")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_type_id")
    private Integer ticketTypeId;

    
    @JoinColumn(name = "event_id", nullable = false)
    private Integer eventId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type_name", nullable = false)
    private TicketType typeName;   // GOLD, SILVER, VIP

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity;
}
