package com.ssafy.bbogle.project.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "전체 프로젝트 조회 응답 DTO")
public class ProjectListResponse {

    @Schema(description = "프로젝트 정보 리스트")
    private List<ProjectListItemResponse> projectList;
}
