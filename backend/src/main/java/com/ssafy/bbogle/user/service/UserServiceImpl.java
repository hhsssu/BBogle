package com.ssafy.bbogle.user.service;

import com.ssafy.bbogle.common.exception.CustomException;
import com.ssafy.bbogle.common.exception.ErrorCode;
import com.ssafy.bbogle.common.util.LoginUser;
import com.ssafy.bbogle.common.util.RedisUtil;
import com.ssafy.bbogle.common.util.S3Util;
import com.ssafy.bbogle.fcm.entity.Fcm;
import com.ssafy.bbogle.fcm.repository.FcmRepository;
import com.ssafy.bbogle.user.dto.request.UpdateNicknameRequest;
import com.ssafy.bbogle.user.dto.response.UserInfoResponse;
import com.ssafy.bbogle.user.dto.response.UserNicknameResponse;
import com.ssafy.bbogle.user.entity.User;
import com.ssafy.bbogle.user.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RedisUtil redisUtil;
    private final S3Util s3Util;
    private final FcmRepository fcmRepository;

    @Override
    public UserNicknameResponse getUserNickname() {
        Long kakaoId = LoginUser.getKakaoId();
        User user = userRepository.findByKakaoId(kakaoId)
            .orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));
        return UserNicknameResponse.builder()
            .nickname(user.getNickname())
            .build();
    }

    @Override
    @Transactional
    public void logout(HttpServletResponse response) {

        Long kakaoId = LoginUser.getKakaoId();
        User user = userRepository.findByKakaoId(kakaoId)
            .orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));

        // fcm 토큰도 비활성화
        fcmRepository.findByUser(user).ifPresent(fcm -> fcm.updateIsActive(false));

        redisUtil.delete(kakaoId.toString());

        Cookie deleteCookie = new Cookie("refreshToken", null);
        deleteCookie.setMaxAge(0);
        deleteCookie.setPath("/");
        deleteCookie.setHttpOnly(true);
        deleteCookie.setSecure(true);
        response.addCookie(deleteCookie);

    }

    @Override
    public UserInfoResponse getUserInfo() {
        Long kakaoId = LoginUser.getKakaoId();
        User user = userRepository.findByKakaoId(kakaoId)
            .orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));

        return UserInfoResponse.builder()
            .nickname(user.getNickname())
            .email(user.getEmail())
            .profileImage(user.getProfileImage())
            .build();
    }

    @Override
    @Transactional
    public void updateNickname(UpdateNicknameRequest request) {
        Long kakaoId = LoginUser.getKakaoId();
        User user = userRepository.findByKakaoId(kakaoId)
            .orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));

        user.updateNickname(request.getNickname());
    }

    @Override
    @Transactional
    public void updateProfileImage(MultipartFile file) {
        Long kakaoId = LoginUser.getKakaoId();
        User user = userRepository.findByKakaoId(kakaoId)
            .orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));

        String oldProfileImage = user.getProfileImage();

        try {
            user.updateProfileImage(s3Util.upload(file));

            if (oldProfileImage != null) {
                s3Util.deleteFile(oldProfileImage);
            }
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
        }



    }
}
