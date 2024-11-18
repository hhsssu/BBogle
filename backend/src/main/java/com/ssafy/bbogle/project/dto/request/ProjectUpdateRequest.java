package com.ssafy.bbogle.project.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "프로젝트 정보 수정 요청 DTO")
public class ProjectUpdateRequest {

    @Schema(description = "프로젝트명")
    private String title;

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
    private boolean notificationStatus;

    @Schema(description = "알림 시간"
        + "second와 nano는 무시")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime notificationTime;

}
