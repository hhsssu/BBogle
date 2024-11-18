package com.ssafy.bbogle.fcm.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "알림 허용 요청 DTO")
public class FcmSaveRequest {

    @Schema(description = "fcm 토큰")
    private String fcmToken;

}
