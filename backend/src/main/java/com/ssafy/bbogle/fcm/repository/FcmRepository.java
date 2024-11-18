package com.ssafy.bbogle.fcm.repository;

import com.ssafy.bbogle.fcm.entity.Fcm;
import com.ssafy.bbogle.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FcmRepository extends JpaRepository<Fcm, Long> {

    Optional<Fcm> findByUser(User user);

}
