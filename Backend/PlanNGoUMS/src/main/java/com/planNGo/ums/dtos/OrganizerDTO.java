package com.planNGo.ums.dtos;

import com.planNGo.ums.entities.Organizer;

public record OrganizerDTO(
		Long id,
		String firstName,
		String lastName,
		String email,
		String organization
) {
	public static OrganizerDTO fromOrganizer(Organizer organizer) {
		return new OrganizerDTO(
				organizer.getUserDetails().getId(),
				organizer.getUserDetails().getFirstName(),
				organizer.getUserDetails().getLastName(),
				organizer.getUserDetails().getEmail(),
				organizer.getOrganization()
		);
	}
}
