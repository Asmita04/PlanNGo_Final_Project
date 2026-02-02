package com.planNGo.ums.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.planNGo.ums.entities.Document;
import com.planNGo.ums.entities.DocumentsType;
import com.planNGo.ums.entities.User;

import java.util.List;
import java.util.Optional;

public interface DocumentsTypeRepository extends JpaRepository<DocumentsType, Long> {
    

    
    Optional<DocumentsType> findByDocumentType(String documentType);

}
