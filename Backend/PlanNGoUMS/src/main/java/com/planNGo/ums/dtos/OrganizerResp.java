package com.planNGo.ums.dtos;

import com.planNGo.ums.entities.Organizer;

public record OrganizerResp(Boolean isVerifed) {
	public static OrganizerResp fromOrganizer(Organizer organizer) {
		return new OrganizerResp(
				organizer.getIsVerified()
				);
	}
}
