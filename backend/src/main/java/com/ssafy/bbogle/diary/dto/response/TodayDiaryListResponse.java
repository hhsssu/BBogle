package com.ssafy.bbogle.diary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "")
public class TodayDiaryListResponse {

    @Schema(description = "오늘 작성 개발일지 리스트")
    private List<TodayDiaryListItemResponse> diaries;

}
