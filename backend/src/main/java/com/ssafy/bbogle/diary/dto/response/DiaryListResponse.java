package com.ssafy.bbogle.diary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "특정 프로젝트의 개발일지 전체 조회 응답 DTO")
public class DiaryListResponse {

    @Schema(description = "개발일지 리스트")
    private List<DiaryListItemResponse> diaryList;

}
