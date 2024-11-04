package com.ssafy.bbogle.summary.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "회고 등록 요청 DTO")
public class SummaryRequest {

    @Schema(description = "내용")
    private String content;

}
