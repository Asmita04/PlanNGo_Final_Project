package com.planNGo.ums.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "documents") 
@AttributeOverride(name = "id", column = @Column(name = "document_id"))
@NoArgsConstructor
@Getter
@Setter
public class Document extends BaseEntity  {
	
	private String s3Key;
	 
	 @Column(columnDefinition = "TEXT")
	private String s3Url;
	
	@ManyToOne
	@JoinColumn(name="document_type_id",nullable=false)
	private DocumentsType documentsType; 
	
	 @OneToOne 
	 @JoinColumn(name="user_id",nullable = false)
	 private User userDetails;
	     
}
