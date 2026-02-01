
package com.planngo.ticketservice.dto;

import java.time.LocalDateTime;

//import com.planngo.ticketservice.model.Event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventResponse {

    // private Integer eventId;
    private String title;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isApproved;
    private Boolean isExpired;

   
}
