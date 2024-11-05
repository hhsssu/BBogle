package com.ssafy.bbogle.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "유저 정보 조회 응답 DTO")
public class UserInfoResponse {

    @Schema(description = "닉네임")
    private String nickname;

    @Schema(description = "프로필 이미지")
    private String profileImage;

    @Schema(description = "가입 이메일")
    private String email;

}
