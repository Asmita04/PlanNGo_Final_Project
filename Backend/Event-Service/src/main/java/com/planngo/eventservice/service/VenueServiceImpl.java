package com.planngo.eventservice.service;

import com.planngo.eventservice.exceptions.ResourceNotFoundException;
import com.planngo.eventservice.dto.ApiResponse;
import com.planngo.eventservice.dto.VenueRequest;
import com.planngo.eventservice.dto.VenueResponse;
import com.planngo.eventservice.model.Venue;
import com.planngo.eventservice.repository.VenueRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class VenueServiceImpl implements VenueService{

    private final VenueRepository venueRepository;

    @Override
    public ApiResponse createVenue(VenueRequest venueRequest) {

        Venue venue = Venue.builder()
                .venueName(venueRequest.getVenueName())
                .capacity(venueRequest.getCapacity())
                .location(venueRequest.getLocation())
                .address(venueRequest.getAddress())
                .city(venueRequest.getCity())
                .state(venueRequest.getState())
                .country(venueRequest.getCountry())
                .postalCode(venueRequest.getPostalCode())
                .contactPhone(venueRequest.getContactPhone())
                .contactEmail(venueRequest.getContactEmail())
                .googleMapsUrl(venueRequest.getGoogleMapsUrl())
                .description(venueRequest.getDescription())
                .isAvailable(venueRequest.getIsAvailable())
                .build();


        Venue persistedVenue = venueRepository.save(venue);

        return new ApiResponse("Created!", "Venue created successfully with Venue Id: " + persistedVenue.getVenueId());
    }

    @Override
    public ApiResponse updateVenue(Integer venueId, VenueRequest venueRequest) {
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found"));

        // Update all mutable fields
        venue.setVenueName(venueRequest.getVenueName());
        venue.setCapacity(venueRequest.getCapacity());
        venue.setLocation(venueRequest.getLocation());
        venue.setAddress(venueRequest.getAddress());
        venue.setCity(venueRequest.getCity());
        venue.setState(venueRequest.getState());
        venue.setCountry(venueRequest.getCountry());
        venue.setPostalCode(venueRequest.getPostalCode());
        venue.setContactPhone(venueRequest.getContactPhone());
        venue.setContactEmail(venueRequest.getContactEmail());
        venue.setGoogleMapsUrl(venueRequest.getGoogleMapsUrl());
        venue.setDescription(venueRequest.getDescription());
        venue.setIsAvailable(venueRequest.getIsAvailable());


        venueRepository.save(venue);
        return new ApiResponse("Success", "venue updated! for venue Id "+venue.getVenueId());
    }

    @Override
    public ApiResponse deleteVenue(Integer VenueId) {
        if (!venueRepository.existsById(VenueId)) {
            throw new ResourceNotFoundException("venue doesn't exist!");
        }
        venueRepository.deleteById(VenueId);
        return new ApiResponse("Success", "venue deleted...");
    }

    @Override
    public List<VenueResponse> getAllVenues() {
        return venueRepository.findAll()
                .stream()
                .map(VenueResponse::fromEntity) // clean mapping
                .toList();
    }

    @Override
    public VenueResponse getVenueDetails(Integer venueId) {
        Venue venue = venueRepository.findById(venueId).orElseThrow(()-> new ResourceNotFoundException("Venue not found!" + venueId));
        return VenueResponse.fromEntity(venue);
    }
}

