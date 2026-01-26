package com.planngo.eventservice.service;

import com.planngo.eventservice.dto.ApiResponse;
import com.planngo.eventservice.dto.EventRequest;
import com.planngo.eventservice.dto.EventResponse;
import com.planngo.eventservice.model.Event;

import java.util.List;

public interface EventService {

    //to create Event
    ApiResponse createEvent(EventRequest eventRequest);

    //To get all the events
    List<EventResponse> getAllEvents();

    //to get event details for specified event Id
    EventResponse getEventDetails(int EventId);

    //updateEventDetails
    ApiResponse updateEvent(int eventId, Event event);

    //delete Event
    ApiResponse deleteEvent(int EventId);

    //is Event expire
    boolean isEventExpired(Event event);
}
