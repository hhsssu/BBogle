package com.ssafy.bbogle.activity.repository;

import com.ssafy.bbogle.activity.entity.Activity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long>, ActivityRepositoryCustom {

    Optional<Activity> findById(Integer id);

}
