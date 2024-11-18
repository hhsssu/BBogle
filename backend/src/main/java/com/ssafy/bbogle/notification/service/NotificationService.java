package com.ssafy.bbogle.notification.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.WebpushConfig;
import com.ssafy.bbogle.fcm.entity.Fcm;
import com.ssafy.bbogle.notification.entity.Notification;
import com.ssafy.bbogle.notification.repository.NotificationRepository;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationRepository notificationRepository;

    @Transactional
    public void sendNotification(LocalTime currentTime){

        List<Notification> notifications = notificationRepository.findActiveNotifications(currentTime);
        for (Notification notification : notifications) {
            Fcm fcm = notification.getProject().getUser().getFcm();
            log.info("pushing notification to FCM: {}, project: {}", fcm.getId(),
                notification.getProject().getId());
            sendPushNotification(fcm.getFcmToken(), "개발일지를 작성할 시간입니다!",
                String.format("프로젝트 '%s'의 개발일지를 작성하세요.", notification.getProject().getTitle()));
        }

    }

    public void sendPushNotification(String fcmToken, String title, String body){
//        Message message = Message.builder()
//            .setToken(fcmToken)
//            .setNotification(com.google.firebase.messaging.Notification.builder()
//                .setTitle(title)
//                .setBody(body)
//                .build())
//            .build();

//        Message message = Message.builder()
//            .setWebpushConfig(WebpushConfig.builder()
//                .setNotification(WebpushNotification.builder()
//                    .setTitle(title)
//                    .setBody(body)
//                    .build())
//                .build())
//            .setToken(fcmToken)
//            .build();

        Message message = Message.builder()
            .setWebpushConfig(WebpushConfig.builder()
                .putHeader("Urgency", "high")
                .build())
            .putData("title", title)
            .putData("body", body)
            .putData("url", "https://bbogle.me")
            .setToken(fcmToken)
            .build();

        try {
            String sendMessageId = FirebaseMessaging.getInstance().send(message);
            log.info("firebase message send : {}", sendMessageId);
            log.info("Sending push notification from thread: {}", Thread.currentThread().threadId());
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

}
