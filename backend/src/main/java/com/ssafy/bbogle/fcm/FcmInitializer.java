package com.ssafy.bbogle.fcm;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.IOException;
import javax.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FcmInitializer {

    private static final String FIREBASE_CONFIG_PATH = "bbogle-c47b4-firebase-adminsdk-u0qbs-1b00a4d6f7.json";

    @PostConstruct
    public void initialize(){
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                GoogleCredentials googleCredentials = GoogleCredentials
                    .fromStream(new ClassPathResource(FIREBASE_CONFIG_PATH).getInputStream());
                FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(googleCredentials)
                    .build();
                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            log.info("FCM initialization failed");
            log.error(e.getMessage());
        }
    }

}
