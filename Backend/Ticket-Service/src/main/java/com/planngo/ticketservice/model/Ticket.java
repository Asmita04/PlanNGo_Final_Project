package com.planngo.ticketservice.model;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name ="tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="Ticket_id")
	private Integer ticketId;
	
	@Enumerated(EnumType.STRING)
	@Column(name ="Status")
	private TicketStatus status;
	
	@Column(name ="Count")
	private Integer count;
	
	@Column(name= "Created_at")
	private LocalDateTime createdAt;
	
	@Column(name ="Price")
	private Double price;
	
	@Column(name="Customer_id",nullable = false)
	private Integer customerId;
	
	@Column(name="Event_id",nullable = false)
	private Integer eventId;
	
	@Enumerated(EnumType.STRING)
	@Column(name="ticket_type",nullable=false)
	private TicketType ticketType;
}
