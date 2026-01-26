package com.planNGo.ums.dtos;

import java.time.LocalDateTime;


public record ApiResponse(
        LocalDateTime timeStamp,
        String status,
        String message
) 
{
    public ApiResponse(String status, String message) {
        this(LocalDateTime.now(), status, message);
    }
}
