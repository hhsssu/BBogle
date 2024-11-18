package com.ssafy.bbogle.notification.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.bbogle.fcm.entity.QFcm;
import com.ssafy.bbogle.notification.entity.Notification;
import com.ssafy.bbogle.notification.entity.QNotification;
import com.ssafy.bbogle.project.entity.QProject;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class NotificationCustomImpl implements NotificationCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Notification> findActiveNotifications(LocalTime time) {

        QNotification qNotification = QNotification.notification;
        QProject qProject = QProject.project;
        QFcm qFcm = QFcm.fcm;

        return queryFactory
            .selectFrom(qNotification)
            .join(qNotification.project, qProject)
            .join(qFcm).on(qFcm.user.eq(qProject.user))
            .where(
                qNotification.time.eq(time),
                qNotification.status.isTrue(),
                qProject.status.isTrue(),
                qFcm.isActive.isTrue()
            )
            .fetch();
    }
}
