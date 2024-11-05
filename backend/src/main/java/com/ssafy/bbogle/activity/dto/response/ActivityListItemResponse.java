package com.ssafy.bbogle.activity.dto.response;

import com.ssafy.bbogle.keyword.dto.response.KeywordInfoResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "경험 리스트 요소 DTO")
public class ActivityListItemResponse {

    @Schema(description = "경험 ID")
    private Integer activityId;

    @Schema(description = "경험 소제목")
    private String title;

    @Schema(description = "시작날짜")
    private LocalDate startDate;

    @Schema(description = "마감날짜")
    private LocalDate endDate;

    @Schema(description = "키워드ID 리스트")
    private List<KeywordInfoResponse> keywords;

    @Schema(description = "프로젝트 제목")
    private String projectTitle;

}
