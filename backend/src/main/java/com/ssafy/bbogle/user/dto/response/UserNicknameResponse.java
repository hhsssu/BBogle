package com.ssafy.bbogle.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "유저 닉네임 조회")
public class UserNicknameResponse {

    @Schema(description = "닉네임")
    private String nickname;

}
