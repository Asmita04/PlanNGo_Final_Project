package com.planngo.eventservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrganizerResp {
    private Long organizerId;
    private Boolean isVerified;
}