package com.planngo.eventservice.dto;

public record VenueRequest(
        String venueName,
        String location,
        Integer capacity,
        Boolean isApproved
) {}
