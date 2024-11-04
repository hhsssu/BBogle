package com.ssafy.bbogle.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "닉네임 수정 요청 DTO")
public class UpdateNicknameRequest {

    @Schema(description = "새 닉네임")
    private String nickname;

}
