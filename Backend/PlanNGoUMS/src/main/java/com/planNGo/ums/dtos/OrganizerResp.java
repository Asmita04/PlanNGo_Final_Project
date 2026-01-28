package com.planNGo.ums.dtos;

import com.planNGo.ums.entities.Organizer;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizerResp {

	private Long organizerId;
	private String organization;
	private Boolean isVerified;
	private Double revenue;

	public static OrganizerResp fromOrganizer(Organizer organizer) {
		return OrganizerResp.builder()
				.organizerId(organizer.getId())
				.organization(organizer.getOrganization())
				.isVerified(organizer.getIsVerified())
				.revenue(organizer.getRevenue())
				.build();
	}
}
