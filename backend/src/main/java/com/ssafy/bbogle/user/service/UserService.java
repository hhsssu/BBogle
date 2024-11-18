package com.ssafy.bbogle.user.service;

import com.ssafy.bbogle.user.dto.request.UpdateNicknameRequest;
import com.ssafy.bbogle.user.dto.response.UserInfoResponse;
import com.ssafy.bbogle.user.dto.response.UserNicknameResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    UserNicknameResponse getUserNickname();

    void logout(HttpServletResponse response);

    UserInfoResponse getUserInfo();

    void updateNickname(UpdateNicknameRequest request);

    void updateProfileImage(MultipartFile file);
}
