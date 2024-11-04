package com.ssafy.bbogle.user.controller;

import com.ssafy.bbogle.user.dto.request.UpdateNicknameRequest;
import com.ssafy.bbogle.user.dto.request.UpdateProfileRequest;
import com.ssafy.bbogle.user.dto.response.UserInfoResponse;
import com.ssafy.bbogle.user.dto.response.UserNicknameResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@Tag(name = "UserController", description = "회원 컨트롤러")
public class UserController {

    @Operation(summary = "회원정보 조회")
    @GetMapping()
    public ResponseEntity<UserInfoResponse> getUser() {
        return null;
    }

    @Operation(summary = "닉네임 조회")
    @GetMapping("/nickname")
    public ResponseEntity<UserNicknameResponse> getUserNickname(){
        return null;
    }

    @Operation(summary = "닉네임 수정")
    @PatchMapping("/nickname")
    public ResponseEntity<String> updateNickname(@RequestBody UpdateNicknameRequest request) {
        return null;
    }

    @Operation(summary = "프로필 수정")
    @PatchMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody UpdateProfileRequest request) {
        return null;
    }

}
