package com.ssafy.bbogle.project.controller;

import com.ssafy.bbogle.activity.dto.request.ActivitySelectRequest;
import com.ssafy.bbogle.activity.dto.response.ActivityListResponse;
import com.ssafy.bbogle.project.dto.request.NotificationStatusRequest;
import com.ssafy.bbogle.project.dto.request.ProjectCreateRequest;
import com.ssafy.bbogle.project.dto.request.ProjectUpdateRequest;
import com.ssafy.bbogle.project.dto.response.ProjectListResponse;
import com.ssafy.bbogle.project.dto.response.ProjectDetailResponse;
import com.ssafy.bbogle.summary.dto.request.SummaryRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "ProjectController", description = "프로젝트 컨트롤러")
public class ProjectController {

    @Operation(summary = "프로젝트 생성",
        description = "role과 skill은 List<String> 형태로 요청<br>"
            + "알림은 꺼짐이 false(0), 켜짐이 true(1)<br>"
            + "알림 시간은 hour, minute 정보만 요청")
    @PostMapping()
    public ResponseEntity<String> createProject(@RequestBody ProjectCreateRequest request) {
        return null;
    }

    @Operation(summary = "내 프로젝트 전체 조회",
        description = "status 1이 진행중, 0이 종료<br>"
            + "notificationStatus 1이 ON, 0이 OFF")
    @GetMapping()
    public ResponseEntity<ProjectListResponse> getAllProjects() {
        return null;
    }

    @Operation(summary = "진행중인 프로젝트 조회")
    @GetMapping("/in-progress")
    public ResponseEntity<ProjectListResponse> getInProgressProjects() {
        return null;
    }

    @Operation(summary = "프로젝트 상세 조회",
        description = "status 1이 진행중, 0이 종료")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDetailResponse> getProjectById(
        @PathVariable("projectId") Integer projectId) {
        return null;
    }

    @Operation(summary = "프로젝트 정보 수정",
        description = "role과 skill은 List<String> 형태로 요청<br>"
            + "알림은 꺼짐이 false(0), 켜짐이 true(1)<br>"
            + "알림 시간은 hour, minute 정보만 요청")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @PatchMapping("/{projectId}")
    public ResponseEntity<String> updateProject(@PathVariable("projectId") Integer projectId,
        @RequestBody ProjectUpdateRequest request) {
        return null;
    }

    @Operation(summary = "프로젝트 삭제")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @DeleteMapping("/{projectId}")
    public ResponseEntity<String> deleteProject(@PathVariable("projectId") Integer projectId) {
        return null;
    }

    @Operation(summary = "프로젝트 종료", description = "프로젝트 종료 버튼을 누르면 프로젝트 상태를 종료로 변경 + AI 회고 저장")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @PatchMapping("/{projectId}/end")
    public ResponseEntity<String> endProject(@PathVariable("projectId") Integer projectId,
        @RequestBody SummaryRequest request) {
        return null;
    }

    @Operation(summary = "프로젝트 알림 ON/OFF", description = "알림 켜짐(1), 꺼짐(0)")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @PatchMapping("/{projectId}/notification")
    public ResponseEntity<String> notificationProject(@PathVariable("projectId") Integer projectId,
        @RequestBody NotificationStatusRequest request) {
        return null;
    }

    // 경험 관련

    @Operation(summary = "특정 프로젝트에 대한 저장된 경험 조회", description = "경험추출시 기존 경험 조회에 사용")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @GetMapping("/{projectId}/activities")
    public ResponseEntity<ActivityListResponse> getActivitiesByProjectId(@PathVariable("projectId") Integer projectId){
        return null;
    }

    @Operation(summary = "추출된 경험 선택", description = "경험추출한 후 저장할 항목 선택할 때 사용")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @PostMapping("/{projectId}/activities")
    public ResponseEntity<String> selectActivity(@PathVariable("projectId") Integer projectId,
        @RequestBody ActivitySelectRequest request) {
        // 기존 저장된 경험들과 선택된 경험 비교해서 수정 + 추출된 경험 중 선택된 경험 해당 프로젝트ID 달고 추가
        return null;
    }

}
