package com.ssafy.bbogle.project.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "프로젝트 제목 리스트 응답 DTO")
public class ProjectTitleListResponse {

    @Schema(description = "프로젝트 제목 리스트")
    private List<ProjectTitleItemResponse> projects;

}
