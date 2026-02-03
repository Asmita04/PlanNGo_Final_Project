package com.planngo.eventservice.model;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer eventId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(name = "event_image")
    private String eventImage;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)        
    private LocalDateTime endDate;

    @Column(name = "is_approved")
    private Boolean isApproved = false ;

    @Column(name = "is_expired", nullable = false)
    private Boolean isExpired = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_category", nullable = false, length = 30)
    private EventCategory category;

    @ManyToOne//(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Venue venue;

    @Column(name="organizer_id", nullable = true)
    private Long organizerId;

    //to sync event expiry date in db
    @PrePersist
    @PreUpdate
    private void syncExpiry() {
        if (endDate != null && endDate.isBefore(LocalDateTime.now())) {
            this.isExpired = true;
        }
    }

}
