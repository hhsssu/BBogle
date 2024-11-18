package com.ssafy.bbogle.user.controller;

import com.ssafy.bbogle.user.dto.request.UpdateNicknameRequest;
import com.ssafy.bbogle.user.dto.request.UpdateProfileRequest;
import com.ssafy.bbogle.user.dto.response.UserInfoResponse;
import com.ssafy.bbogle.user.dto.response.UserNicknameResponse;
import com.ssafy.bbogle.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
@Tag(name = "UserController", description = "회원 컨트롤러")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "회원정보 조회 (완료)")
    @GetMapping()
    public ResponseEntity<UserInfoResponse> getUser() {
        UserInfoResponse result = userService.getUserInfo();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @Operation(summary = "닉네임 조회 (완료)")
    @GetMapping("/nickname")
    public ResponseEntity<UserNicknameResponse> getUserNickname(){
        UserNicknameResponse result = userService.getUserNickname();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @Operation(summary = "닉네임 수정 (완료)")
    @PatchMapping("/nickname")
    public ResponseEntity<String> updateNickname(@RequestBody UpdateNicknameRequest request) {
        userService.updateNickname(request);
        return ResponseEntity.status(HttpStatus.OK).body("닉네임 수정 성공");
    }

    @Operation(summary = "프로필 사진 수정")
    @Parameters(value = {
        @Parameter(name = "profileImage", description = "프로필 사진")
    })
    @PatchMapping("/profile")
    public ResponseEntity<String> updateProfileImage(@RequestParam("profileImage") MultipartFile file) {
        userService.updateProfileImage(file);
        return ResponseEntity.status(HttpStatus.OK).body("프로필 사진 수정 성공");
    }

    @Operation(summary = "로그아웃 (완료)", description = " (백) 리프레시 토큰 삭제 (프론트) 액세스 토큰 삭제")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        userService.logout(response);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
