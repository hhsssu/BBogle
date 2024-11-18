package com.ssafy.bbogle.project.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "알림 ON/OFF 요청 DTO")
public class NotificationStatusRequest {

    @Schema(description = "알림 상태 켜짐(1), 꺼짐(0)")
    private boolean status;

}
