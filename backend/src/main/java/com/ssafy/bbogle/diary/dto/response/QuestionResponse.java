package com.ssafy.bbogle.diary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "질문 목록 조회 응답 DTO")
public class QuestionResponse {
    @Schema(description = "질문 ID")
    private Integer id;

    @Schema(description = "질문")
    private String question;

    @Schema(description = "질문 설명")
    private String description;
}
