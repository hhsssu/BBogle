package com.ssafy.bbogle.activity.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "경험 검색 조건 요청")
public class ActivitySearchCondRequest {

    @Schema(description = "검색어")
    private String word;

    @Schema(description = "태그ID 리스트")
    private List<Integer> keywords;

    @Schema(description = "프로젝트ID 리스트")
    private List<Integer> projects;

}
