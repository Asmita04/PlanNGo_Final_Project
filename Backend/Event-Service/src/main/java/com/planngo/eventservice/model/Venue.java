package com.planngo.eventservice.model;

import jakarta.persistence.*;
import lombok.*;

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
    private Integer venueId;

    private String venueName;

    private Integer capacity;

    private String location;

    private String address;

    private String city;

    private String state;

    private String country;

    private String postalCode;

    private String contactPhone;

    private String contactEmail;

    private String googleMapsUrl;

    @Column(length = 1000)
    private String description;

    private Boolean isAvailable;
}
