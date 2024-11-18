package com.ssafy.bbogle.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(name = "새로 발급 받은 토큰 응답 DTO")
public class NewTokenResponse {

    @Schema(name = "새로운 액세스 토큰")
    private String accessToken;

}
