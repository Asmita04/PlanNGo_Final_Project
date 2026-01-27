package com.planNGo.ums.entities;

//JPA
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity // to declare entity class - whose life cycle will be managed by Hibernate
@Table(name = "organizers") // to specify table name
/*
 * To override name of PK column to user_id name - inherited field name column -
 * col name
 */
@AttributeOverride(name = "id", column = @Column(name = "organizerId"))
//lombok annotations
@NoArgsConstructor
@Getter
@Setter


public class Organizer extends BaseEntity  {

	 
	 
	 @Column(nullable = true, length = 60)
	 private String organization;
	 
	 
	 private Boolean isVerified;
	 
	 @Column(nullable = true)
	 private Double revenue;
	 
	 @OneToOne //mandatory
	 @JoinColumn(name="user_id",nullable = false)
	 private User userDetails;
	
}
