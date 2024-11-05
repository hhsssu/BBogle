package com.ssafy.bbogle.diary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "오늘 작성한 개발일지")
public class TodayDiaryListItemResponse {

    @Schema(description = "개발일지 ID")
    private Integer diaryId;

    @Schema(description = "AI 요약 제목")
    private String title;

    @Schema(description = "작성날짜")
    private LocalDate createDate;

    @Schema(description = "프로젝트 이름")
    private String projectTitle;

}
