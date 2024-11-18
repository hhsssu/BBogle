package com.ssafy.bbogle.activity.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "경험 자동 등록 DTO")
public class ActivityAutoCreateRequest {

    @Schema(description = "소제목")
    private String title;

    @Schema(description = "내용")
    private String content;

    @Schema(description = "시작날짜")
    private LocalDate startDate;

    @Schema(description = "마감날짜")
    private LocalDate endDate;

    @Schema(description = "키워드ID")
    private Integer keywords;

}
