package com.ssafy.bbogle.summary.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "회고 등록 요청 DTO")
public class SummaryRequest {

    @Schema(description = "내용")
    private String content;

}
