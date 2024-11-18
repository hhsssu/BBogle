package com.ssafy.bbogle.summary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "회고 조회 응답 DTO")
public class SummaryResponse {

    @Schema(description = "회고 ID")
    private Integer summaryId;

    @Schema(description = "내용")
    private String content;

}
