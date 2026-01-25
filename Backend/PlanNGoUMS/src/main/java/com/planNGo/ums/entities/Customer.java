package com.planNGo.ums.entities;

import java.time.LocalDate;

//JPA
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity // to declare entity class - whose life cycle will be managed by Hibernate
@Table(name = "customers") // to specify table name
/*
 * To override name of PK column to user_id name - inherited field name column -
 * col name
 */
@AttributeOverride(name = "id", column = @Column(name = "customer_id"))
//lombok annotations
@NoArgsConstructor
@Getter
@Setter


public class Customer extends BaseEntity  {

	private LocalDate dob;
	
	
	@Enumerated(EnumType.STRING) // column type - varchar | Enum
	private Gender gender;
	
	 
	 @OneToOne //mandatory
	 @JoinColumn(name="user_id",nullable = false)
	 private User userDetails;

	
}
