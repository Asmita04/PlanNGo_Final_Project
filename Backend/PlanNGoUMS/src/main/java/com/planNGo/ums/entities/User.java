package com.planNGo.ums.entities;

import java.time.LocalDate;

//JPA
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity // to declare entity class - whose life cycle will be managed by Hibernate
@Table(name = "users") // to specify table name
/*
 * To override name of PK column to user_id name - inherited field name column -
 * col name
 */
@AttributeOverride(name = "id", column = @Column(name = "user_id"))
//lombok annotations
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = { "password", "image" }, callSuper = true)

public class User extends BaseEntity  {

	@Column(name = "first_name", length = 30) // varchar(30)
	private String firstName;
	@Column(name = "last_name", length = 30)
	private String lastName;
	@Column(unique = true, length = 50) // add UNIQUE constraint
	private String email;
	// not null constraint
	@Column(nullable = false)
	private String password;
//	@Transient //skips from persistence (i.e column will not be created )
//	private String confirmPassword;
	// Date , Calendar , GregorainCalendar - older Java API - @Temporal
	// no annotation required for modern java date times
	private LocalDate dob;
	@Column(name = "reg_amount")
	private int regAmount;
	@Enumerated(EnumType.STRING) // column type - varchar | Enum
	@Column(name = "user_role")
	private UserRole userRole;
	@Column(unique = true, length = 14)
	private String phone;
	@Lob // column type - for Mysql : longblob
	private byte[] image;

	public User(String firstName, String lastName, String email, String password, LocalDate dob, int regAmount,
			String phone) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.dob = dob;
		this.regAmount = regAmount;
		this.phone = phone;
	}

	
}
