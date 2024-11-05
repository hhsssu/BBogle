package com.ssafy.bbogle.project.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "프로젝트 생성 요청 DTO")
public class ProjectCreateRequest {

    @Schema(description = "프로젝트명")
    private String title;

    @Schema(description = "프로젝트 사진")
    private String image;

    @Schema(description = "프로젝트 개요")
    private String description;

    @Schema(description = "시작날짜")
    private LocalDate startDate;

    @Schema(description = "종료날짜")
    private LocalDate endDate;

    @Schema(description = "프로젝트 인원")
    private Integer memberCount;

    @Schema(description = "나의 역할 리스트")
    private List<String> role;

    @Schema(description = "사용 스킬 리스트")
    private List<String> skill;

    @Schema(description = "알림 ON/OFF"
        + "꺼짐 : false(0)"
        + "켜짐 : true(1)")
    private Boolean notificationStatus;

    @Schema(description = "알림 시간"
        + "second와 nano는 무시")
    private LocalTime notificationTime;


}
