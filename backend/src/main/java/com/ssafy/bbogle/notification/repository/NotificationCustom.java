package com.ssafy.bbogle.notification.repository;

import com.ssafy.bbogle.notification.entity.Notification;
import java.time.LocalTime;
import java.util.List;

public interface NotificationCustom {

    List<Notification> findActiveNotifications(LocalTime time);

}
