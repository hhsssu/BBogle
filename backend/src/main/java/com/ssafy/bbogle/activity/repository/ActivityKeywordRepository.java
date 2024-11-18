package com.ssafy.bbogle.activity.repository;

import com.ssafy.bbogle.activity.entity.ActivityKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityKeywordRepository extends JpaRepository<ActivityKeyword, Long> {

}
