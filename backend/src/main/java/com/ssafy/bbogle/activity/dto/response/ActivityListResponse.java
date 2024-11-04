package com.ssafy.bbogle.activity.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "경험 리스트 응답 DTO")
public class ActivityListResponse {

    @Schema(description = "경험 리스트")
    private List<ActivityListItemResponse> activities;

}
