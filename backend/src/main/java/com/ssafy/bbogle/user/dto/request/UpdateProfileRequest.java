package com.ssafy.bbogle.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "프로필 수정 요청 DTO")
public class UpdateProfileRequest {

    @Schema(description = "프로필 수정 요청 DTO")
    private String profileImage;

}
