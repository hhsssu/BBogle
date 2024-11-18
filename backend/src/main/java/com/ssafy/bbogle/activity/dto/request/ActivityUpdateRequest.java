package com.ssafy.bbogle.activity.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "경험 수정 요청")
public class ActivityUpdateRequest {

    @Schema(description = "소제목")
    private String title;

    @Schema(description = "내용")
    private String content;

    @Schema(description = "시작날짜")
    private LocalDate startDate;

    @Schema(description = "마감날짜")
    private LocalDate endDate;

    @Schema(description = "키워드ID 리스트, 선택 안 할 땐 빈 리스트 입력(null 금지)")
    private List<Integer> keywords;

    @Schema(description = "프로젝트 ID, 없으면 null")
    private Integer projectId;

}
