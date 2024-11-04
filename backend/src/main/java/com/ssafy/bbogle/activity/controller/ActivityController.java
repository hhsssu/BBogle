package com.ssafy.bbogle.activity.controller;

import com.ssafy.bbogle.activity.dto.request.ActivityUpdateRequest;
import com.ssafy.bbogle.activity.dto.request.ActivityUserCreateRequest;
import com.ssafy.bbogle.activity.dto.request.ActivitySearchCondRequest;
import com.ssafy.bbogle.activity.dto.response.ActivityDetailResponse;
import com.ssafy.bbogle.activity.dto.response.ActivityListResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Getter;
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
@RequestMapping("/api/activities")
@Tag(name = "ActivityController", description = "경험정리 컨트롤러")
public class ActivityController {

    @Operation(summary = "경험 수동 등록", description = "keywords는 키워드 ID를 담은 리스트로 요청<br>"
        + "ID는 모두 Integer")
    @PostMapping()
    public ResponseEntity<String> createActivity(@RequestBody ActivityUserCreateRequest request) {
        return null;
    }

    @Operation(summary = "내 경험 전체 조회", description = "요청 : word는 검색어, keywords는 키워드 ID를 담은 리스트, projects는 프로젝트 ID를 담은 리스트"
        + "ID는 모두 Integer<br>"
        + "word는 null, keywords 리스트 크기 0, projects 리스트 크기 0이면 전체조회<br><br>"
        + "응답 : keywords 정보중 type은 0이면 기술, 1이면 인성 태그")
    @PostMapping("/search")
    public ResponseEntity<ActivityListResponse> searchActivity(@RequestBody ActivitySearchCondRequest request) {
        return null;
    }

    @Operation(summary = "경험 상세 조회")
    @Parameters(value = {
        @Parameter(name = "activityId", description = "경험 ID", in = ParameterIn.PATH)
    })
    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityDetailResponse> getActivityDetail(@PathVariable("activityId") Integer activityId){
        return null;
    }


    @Operation(summary = "경험 수정")
    @Parameters(value = {
        @Parameter(name = "activityId", description = "경험 ID", in = ParameterIn.PATH)
    })
    @PatchMapping("/{activityId}")
    public ResponseEntity<String> updateActivity(@PathVariable("activityId") Integer activityId,
        @RequestBody ActivityUpdateRequest request){
        return null;
    }

    @Operation(summary = "경험 삭제")
    @Parameters(value = {
        @Parameter(name = "activityId", description = "경험 ID", in = ParameterIn.PATH)
    })
    @DeleteMapping("/{activityId}")
    public ResponseEntity<String> deleteActivity(@PathVariable("activityId") Integer activityId){
        return null;
    }

}
