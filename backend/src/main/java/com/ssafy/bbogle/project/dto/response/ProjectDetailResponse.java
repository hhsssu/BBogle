package com.ssafy.bbogle.project.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "프로젝트 상세 정보 응답 DTO")
public class ProjectDetailResponse {

    @Schema(description = "프로젝트 아이디")
    private Integer projectId;

    @Schema(description = "이미지")
    private String image;

    @Schema(description = "제목")
    private String title;

    @Schema(description = "개요")
    private String description;

    @Schema(description = "진행상태")
    private Boolean status;

    @Schema(description = "시작날짜")
    private LocalDate startDate;

    @Schema(description = "종료날짜")
    private LocalDate endDate;

    @Schema(description = "참여 인원")
    private Integer memberCount;

    @Schema(description = "나의 역할 리스트")
    private List<String> role;

    @Schema(description = "사용 스킬 리스트")
    private List<String> skill;

}
