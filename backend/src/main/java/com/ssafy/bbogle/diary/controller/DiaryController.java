package com.ssafy.bbogle.diary.controller;

import com.ssafy.bbogle.diary.dto.request.DiaryCreateRequest;
import com.ssafy.bbogle.diary.dto.request.DiaryUpdateRequest;
import com.ssafy.bbogle.diary.dto.response.DiaryDetailResponse;
import com.ssafy.bbogle.diary.dto.response.DiaryListResponse;
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
@RequestMapping("/api")
@Tag(name = "DiaryController", description = "개발일지 컨트롤러")
public class DiaryController {

    @Operation(summary = "오늘 내가 작성한 개발일지")
    @GetMapping("/diaries/today")
    public ResponseEntity<DiaryListResponse> getTodayDiary() {
        return null;
    }

    @Operation(summary = "특정 프로젝트의 개발일지 목록 조회")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @GetMapping("/projects/{projectId}/diaries")
    public ResponseEntity<DiaryListResponse> getAllDiaries(
        @PathVariable("projectId") Integer projectId){
        return null;
    }

    @Operation(summary = "개발일지 등록")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @PostMapping("/projects/{projectId}/diaries")
    public ResponseEntity<String> createDiary(
        @PathVariable("projectId") Integer projectId,
        @RequestBody DiaryCreateRequest request){
        return null;
    }

    @Operation(summary = "개발일지 상세 조회")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH),
        @Parameter(name = "diaryId", description = "개발일지 ID", in = ParameterIn.PATH)
    })
    @GetMapping("/projects/{projectId}/diaries/{diaryId}")
    public ResponseEntity<DiaryDetailResponse> getDiaryDetail(
        @PathVariable("projectId") Integer projectId,
        @PathVariable("diaryId") Integer diaryId
    ){
        return null;
    }

    @Operation(summary = "개발일지 수정")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH),
        @Parameter(name = "diaryId", description = "개발일지 ID", in = ParameterIn.PATH)
    })
    @PatchMapping("/projects/{projectId}/diaries/{diaryId}")
    public ResponseEntity<String> updateDiary(
        @PathVariable("projectId") Integer projectId,
        @PathVariable("diaryId") Integer diaryId,
        @RequestBody DiaryUpdateRequest request){
        return null;
    }

    @Operation(summary = "개발일지 삭제")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH),
        @Parameter(name = "diaryId", description = "개발일지 ID", in = ParameterIn.PATH)
    })
    @DeleteMapping("/projects/{projectId}/diaries/{diaryId}")
    public ResponseEntity<String> deleteDiary(
        @PathVariable("projectId") Integer projectId,
        @PathVariable("diaryId") Integer diaryId){
        return null;
    }

}
