package com.planngo.eventservice.model;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "venues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "venue_id")
    private Integer venueId;

    @Column(name = "venue_name", nullable = false, length = 150)
    private String venueName;

    @Column(nullable = false, length = 200)
    private String location;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "is_approved")
    private Boolean isApproved;

    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Event> events;
}
