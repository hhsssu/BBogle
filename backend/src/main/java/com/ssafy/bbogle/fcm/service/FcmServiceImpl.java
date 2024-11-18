package com.ssafy.bbogle.fcm.service;

import com.ssafy.bbogle.common.exception.CustomException;
import com.ssafy.bbogle.common.exception.ErrorCode;
import com.ssafy.bbogle.common.util.LoginUser;
import com.ssafy.bbogle.fcm.dto.request.FcmSaveRequest;
import com.ssafy.bbogle.fcm.entity.Fcm;
import com.ssafy.bbogle.fcm.repository.FcmRepository;
import com.ssafy.bbogle.user.entity.User;
import com.ssafy.bbogle.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FcmServiceImpl implements FcmService {

    private final UserRepository userRepository;
    private final FcmRepository fcmRepository;

    @Override
    @Transactional
    public void saveFcm(FcmSaveRequest request) {

        Long kakaoId = LoginUser.getKakaoId();
        User user = userRepository.findByKakaoId(kakaoId)
            .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        // fcm 정보가 없는 유저라면 null
        Fcm fcm = fcmRepository.findByUser(user).orElse(null);

        String fcmToken = request.getFcmToken();

        // fcm 정보가 없었다면 새로 저장하고 active를 true로 저장
        if (fcm == null) {
            Fcm newFcm = Fcm.builder()
                .user(user)
                .fcmToken(fcmToken)
                .isActive(true)
                .build();
            fcmRepository.save(newFcm);
        }
        else {
            fcm.updateFcmToken(fcmToken);
        }
    }
}
