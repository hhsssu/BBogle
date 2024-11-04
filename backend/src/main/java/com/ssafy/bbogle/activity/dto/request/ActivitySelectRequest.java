package com.ssafy.bbogle.activity.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "추출된 경험들 중 경험 선택 요청 DTO")
public class ActivitySelectRequest {

    @Schema(description = "기존 경험들 중 최종 선택된 경험 ID 리스트")
    private List<Integer> savedActivities;

    @Schema(description = "새로 생성된 경험들 중 선택된 경험 리스트")
    private List<ActivityAutoCreateRequest> newActivities;

}
