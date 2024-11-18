package com.ssafy.bbogle.diary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "개발일지 상세 조회 응답 DTO")
public class DiaryDetailResponse {
    @Schema(description = "개발일지 ID")
    private Integer diaryId;

    @Schema(description = "제목")
    private String title;

    @Schema(description = "작성일")
    private LocalDate createDate;

    @Schema(description = "질문과 답변 목록")
    private List<QuestionAnswerResponse> answers;

    @Schema(description = "첨부 이미지 리스트")
    private List<String> images;
}
