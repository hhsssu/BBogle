package com.ssafy.bbogle.summary.repository;

import com.ssafy.bbogle.summary.entity.Summary;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SummaryRepository extends JpaRepository<Summary, Long> {

    Optional<Summary> findById(Integer id);

    Optional<Summary> findByProjectId(Integer projectId);

}
