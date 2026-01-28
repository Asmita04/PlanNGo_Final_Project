package com.planngo.eventservice.client;

import com.planngo.eventservice.dto.OrganizerResp;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "planNGo-ums",
        url = "http://localhost:8080",
        path = "/organizer"
)
public interface OrganizerClient {

    // This endpoint is meant ONLY for authorization check
    @GetMapping("/status/{userId}")
    OrganizerResp getOrganizerStatus(@PathVariable Long userId);
}
