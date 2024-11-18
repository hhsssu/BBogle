package com.ssafy.bbogle.fcm.entity;

import com.ssafy.bbogle.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Fcm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "fcm_token")
    private String fcmToken;

    @Column(name = "is_active")
    private boolean isActive;

    public void updateFcmToken(String fcmToken) {
        this.fcmToken = fcmToken;
        this.isActive = true;
    }

    public void updateIsActive(boolean isActive) {
        this.isActive = isActive;
    }

}
