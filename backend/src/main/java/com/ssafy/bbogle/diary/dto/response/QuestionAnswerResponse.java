package com.ssafy.bbogle.diary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "질문과 답변 응답 DTO")
public class QuestionAnswerResponse {
    @Schema(description = "질문")
    private String question;

    @Schema(description = "질문 설명")
    private String description;

    @Schema(description = "답변")
    private String answer;
}
