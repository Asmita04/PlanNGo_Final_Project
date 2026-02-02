package com.planNGo.ums.entities;

import org.modelmapper.internal.bytebuddy.build.HashCodeAndEqualsPlugin.Identity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity // to declare entity class - whose life cycle will be managed by Hibernate
@Table(name = "document_types") // to specify table name

//lombok annotations
@NoArgsConstructor
@Getter
@Setter
public class DocumentsType extends BaseEntity  {
	@Identity
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "document_type",nullable = false)
	private String documentType;

}
