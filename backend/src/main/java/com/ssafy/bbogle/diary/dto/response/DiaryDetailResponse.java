package com.ssafy.bbogle.diary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "개발일지 상세 조회 응답 DTO")
public class DiaryDetailResponse {

    @Schema(description = "개발일지 ID")
    private Integer diaryId;

    @Schema(description = "AI 요약 제목")
    private String title;

    @Schema(description = "답변 리스트")
    private List<String> answers;

    @Schema(description = "첨부 이미지 리스트")
    private List<String> images;

}
