package com.planngo.eventservice.service;

import com.planngo.eventservice.client.OrganizerClient;
import com.planngo.eventservice.exceptions.ResourceNotFoundException;
import com.planngo.eventservice.dto.ApiResponse;
import com.planngo.eventservice.dto.EventRequest;
import com.planngo.eventservice.dto.EventResponse;
import com.planngo.eventservice.dto.OrganizerResp;
import com.planngo.eventservice.model.Event;
import com.planngo.eventservice.model.Venue;
import com.planngo.eventservice.repository.EventRepository;
import com.planngo.eventservice.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;
    private final OrganizerClient organizerClient;

    @Override
    public ApiResponse createEvent(Long userId, EventRequest eventRequest) {
        //TODO: if organizer is valid then only can create event
        OrganizerResp organizer =
                organizerClient.getOrganizerStatus(userId);

        if (organizer.getIsVerified() == null || !organizer.getIsVerified()) {
            throw new IllegalStateException(
                    "Only verified organizers can create events"
            );
        }

        Venue venue = venueRepository.findById(eventRequest.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found"));

        if(!venue.getIsAvailable()){
            throw new ResourceNotFoundException("Venue not available!");
        }

        Event event = Event.builder()
                .title(eventRequest.getTitle())
                .description(eventRequest.getDescription())
                .eventImage(eventRequest.getEventImage())
                .startDate(eventRequest.getStartDate())
                .endDate(eventRequest.getEndDate())
                .isApproved(eventRequest.getIsApproved())
                .category(eventRequest.getCategory())
                .venue(venue)
                .isExpired(false)
                .build();

        Event persistedEvent = eventRepository.save(event);

        return new ApiResponse("Created!", "Event created successfully with Event Id: " + persistedEvent.getEventId());
    }

    @Override
    public List<EventResponse> getAllEvents() {

        return eventRepository.findAll()
                .stream()
                .map(EventResponse::fromEntity) // clean mapping
                .filter(event -> !event.isExpired())
                .toList();
    }

    @Override
    public EventResponse getEventDetails(int eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        return EventResponse.fromEntity(event);
    }

    @Override
    public ApiResponse updateEvent(int eventId, EventRequest eventRequest) {
        Venue venue = venueRepository.findById(eventRequest.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found"));

        Event persistentEvent = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (persistentEvent.getIsExpired()) {
            throw new IllegalStateException("Expired Events cannot be updated!");
        }

        // Update all mutable fields
        persistentEvent.setTitle(eventRequest.getTitle());
        persistentEvent.setDescription(eventRequest.getDescription());
        persistentEvent.setStartDate(eventRequest.getStartDate());
        persistentEvent.setEndDate(eventRequest.getEndDate());
        persistentEvent.setEventImage(eventRequest.getEventImage());
        persistentEvent.setVenue(venue);
        persistentEvent.setCategory(eventRequest.getCategory());
        persistentEvent.setIsApproved(eventRequest.getIsApproved());

        eventRepository.save(persistentEvent);
        return new ApiResponse("Success", "Event updated! for Event Id "+persistentEvent.getEventId());
    }

    @Override
    public ApiResponse deleteEvent(int eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event doesn't exist!");
        }
        eventRepository.deleteById(eventId);
        return new ApiResponse("Success", "Event deleted...");
    }

    @Override
    public boolean isEventExpired(EventRequest eventRequest) {
        return eventRequest.getEndDate().isBefore(LocalDateTime.now());
    }
}