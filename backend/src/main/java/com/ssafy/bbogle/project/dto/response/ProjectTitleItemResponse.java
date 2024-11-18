package com.ssafy.bbogle.project.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "프로젝트 제목 정보 DTO")
public class ProjectTitleItemResponse {

    @Schema(description = "프로젝트 ID")
    private Integer projectId;

    @Schema(description = "프로젝트 제목")
    private String title;

}
