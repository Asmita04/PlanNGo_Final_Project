package com.planngo.eventservice.service;

import com.planngo.eventservice.dto.ApiResponse;
import com.planngo.eventservice.dto.VenueRequest;
import com.planngo.eventservice.dto.VenueResponse;

import java.util.List;

public interface VenueService{

    //create venue
    ApiResponse createVenue(VenueRequest venueRequest);

    //update Venue
    ApiResponse updateVenue(Integer venueId, VenueRequest venueRequest);

    //delete Venue
    ApiResponse deleteVenue(Integer VenueId);

    //get all Venues
    List<VenueResponse> getAllVenues();

    // get venue by id
    VenueResponse getVenueDetails(Integer venueId);
}
