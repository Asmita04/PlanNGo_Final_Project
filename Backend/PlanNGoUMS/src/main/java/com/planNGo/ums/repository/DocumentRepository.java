package com.planNGo.ums.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.planNGo.ums.entities.Document;
import com.planNGo.ums.entities.DocumentsType;
import com.planNGo.ums.entities.User;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long> {
	Optional<Document> findByUserDetails_IdAndDocumentsType_documentType(
            Long userId,
            String documentType
    );
    long countByUserDetails_Id(Long id);
    List<Document> findAllByUserDetails_Id(Long userId);

}
