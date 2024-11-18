package com.ssafy.bbogle.notification.scheduler;

import com.ssafy.bbogle.notification.service.NotificationService;
import java.time.LocalTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationScheduler {

    private final NotificationService notificationService;

    @Scheduled(cron = "0 * * * * *")
    public void sendScheduledNotification() {
        LocalTime currentTime = LocalTime.now().withSecond(0).withNano(0);
        log.info("{} start sending notification", currentTime.toString());
        notificationService.sendNotification(currentTime);
        log.info("{} end sending notification", currentTime.toString());
    }

}
