package com.planngo.eventservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VenueRequest {

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
        private String description;
        private Boolean isAvailable;
}
