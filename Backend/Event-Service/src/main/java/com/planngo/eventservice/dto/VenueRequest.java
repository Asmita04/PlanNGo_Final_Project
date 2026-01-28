package com.planngo.eventservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VenueRequest{
        String venueName;
        String city;
        String location;
        String locationURL;
        Integer capacity;
        Boolean isAvailable;
}
