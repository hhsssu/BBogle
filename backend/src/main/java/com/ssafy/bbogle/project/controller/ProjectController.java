package com.ssafy.bbogle.project.controller;

import com.ssafy.bbogle.activity.dto.request.ActivitySelectRequest;
import com.ssafy.bbogle.activity.dto.response.ActivityListResponse;
import com.ssafy.bbogle.project.dto.request.NotificationStatusRequest;
import com.ssafy.bbogle.project.dto.request.ProjectCreateRequest;
import com.ssafy.bbogle.project.dto.request.ProjectUpdateRequest;
import com.ssafy.bbogle.project.dto.response.ProjectListResponse;
import com.ssafy.bbogle.project.dto.response.ProjectDetailResponse;
import com.ssafy.bbogle.project.dto.response.ProjectTitleListResponse;
import com.ssafy.bbogle.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/projects")
@Tag(name = "ProjectController", description = "프로젝트 컨트롤러")
public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @Operation(summary = "프로젝트 생성 [完] - Postman으로 하세요",
            description = "role과 skill은 List<String> 형태로 요청<br>"
                    + "알림은 꺼짐이 false(0), 켜짐이 true(1)<br>"
                    + "알림 시간은 hour, minute 정보만 요청")
    @PostMapping()
    public ResponseEntity<String> createProject(
        @RequestPart("request") ProjectCreateRequest request, @RequestPart("file") MultipartFile file ) {
        projectService.createProject(request, file);
        return ResponseEntity.ok("프로젝트가 성공적으로 생성되었습니다.");
    }

    @Operation(summary = "내 프로젝트 전체 조회 [完]",
            description = "status 1이 진행중, 0이 종료<br>"
                    + "notificationStatus 1이 ON, 0이 OFF")
    @GetMapping()
    public ResponseEntity<ProjectListResponse> getAllProjects() {
        ProjectListResponse response = projectService.getAllProjects();
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "진행중인 프로젝트 조회 [完]")
    @GetMapping("/in-progress")
    public ResponseEntity<ProjectListResponse> getInProgressProjects() {
        ProjectListResponse response = projectService.getInProgressProjects();
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "프로젝트 상세 조회 [完]",
            description = "status 1이 진행중, 0이 종료")
    @Parameters(value = {@Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)})
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDetailResponse> getProjectById(@PathVariable("projectId") Integer projectId) {
        ProjectDetailResponse response = projectService.getProjectById(projectId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "프로젝트 정보 수정 [完] - Postman으로 하세요",
            description = "role과 skill은 List<String> 형태로 요청<br>"
                    + "알림은 꺼짐이 false(0), 켜짐이 true(1)<br>"
                    + "알림 시간은 hour, minute 정보만 요청")
    @Parameters(value = {@Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)})
    @PatchMapping("/{projectId}")
    public ResponseEntity<String> updateProject(
            @PathVariable("projectId") Integer projectId,
            @RequestPart("request") ProjectUpdateRequest request,
            @RequestPart("file") MultipartFile file ) {
        projectService.updateProject(projectId, request, file);
        return ResponseEntity.ok("프로젝트가 성공적으로 수정되었습니다.");
    }

    @Operation(summary = "프로젝트 삭제 [完]")
    @Parameters(value = {@Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)})
    @DeleteMapping("/{projectId}")
    public ResponseEntity<String> deleteProject(@PathVariable("projectId") Integer projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.ok("프로젝트가 성공적으로 삭제되었습니다.");
    }

    @Operation(summary = "프로젝트 종료 [完]", description = "프로젝트 종료 버튼을 누르면 프로젝트 상태를 종료로 변경")
    @Parameters(value = {@Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)})
    @PatchMapping("/{projectId}/end")
    public ResponseEntity<String> endProject(
            @PathVariable("projectId") Integer projectId) {
        projectService.endProject(projectId);
        return ResponseEntity.ok("프로젝트가 성공적으로 종료되었습니다.");
    }

    @Operation(summary = "프로젝트 알림 ON/OFF [完]", description = "알림 켜짐(1), 꺼짐(0)")
    @Parameters(value = {@Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)})
    @PatchMapping("/{projectId}/notification")
    public ResponseEntity<String> notificationProject(
            @PathVariable("projectId") Integer projectId,
            @RequestBody NotificationStatusRequest request) {
        projectService.toggleNotificationStatus(projectId, request);
        return ResponseEntity.ok("알림 상태가 성공적으로 변경되었습니다.");
    }

    @Operation(summary = "특정 프로젝트에 대한 저장된 경험 조회 (완료)", description = "경험추출시 기존 경험 조회에 사용<br>"
        + "조회 결과가 없으면 빈 리스트 반환")
    @Parameters(value = {
            @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @GetMapping("/{projectId}/activities")
    public ResponseEntity<ActivityListResponse> getActivitiesByProjectId(
            @PathVariable("projectId") Integer projectId) {
        ActivityListResponse result = projectService.getActivitiesByProject(projectId);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "추출된 경험 선택 (완료)", description = "경험추출한 후 저장할 항목 선택할 때 사용")
    @Parameters(value = {
            @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @PostMapping("/{projectId}/activities")
    public ResponseEntity<String> selectActivity(
            @PathVariable("projectId") Integer projectId,
            @RequestBody ActivitySelectRequest request) {
        projectService.selectActivity(projectId, request);
        return ResponseEntity.ok("선택한 경험 저장 완료");
    }

    @Operation(summary = "내 프로젝트 조회 - 검색 조건용 (완료)", description = "검색 조건이나 개발일지 프로젝트 선택시 사용<br>"
        + "프로젝트 아이디, 제목만 조회함")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @GetMapping("/title")
    public ResponseEntity<ProjectTitleListResponse> getAllProjectTitle() {
        ProjectTitleListResponse result = projectService.getAllProjectTitle();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}