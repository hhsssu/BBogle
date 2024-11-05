package com.ssafy.bbogle.project.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "알림 ON/OFF 요청 DTO")
public class NotificationStatusRequest {

    @Schema(description = "알림 상태 켜짐(1), 꺼짐(0)")
    private Boolean status;

}
