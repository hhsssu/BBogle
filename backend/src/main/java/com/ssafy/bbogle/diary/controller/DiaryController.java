package com.ssafy.bbogle.diary.controller;

import com.ssafy.bbogle.diary.dto.request.DiaryCreateRequest;
import com.ssafy.bbogle.diary.dto.request.DiaryUpdateRequest;
import com.ssafy.bbogle.diary.dto.response.DiaryDetailResponse;
import com.ssafy.bbogle.diary.dto.response.DiaryListResponse;
import com.ssafy.bbogle.diary.dto.response.QuestionResponse;
import com.ssafy.bbogle.diary.dto.response.TodayDiaryListResponse;
import com.ssafy.bbogle.diary.service.DiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping()
@Tag(name = "DiaryController", description = "개발일지 컨트롤러")
public class DiaryController {
    private final DiaryService diaryService;

    @Operation(summary = "오늘 내가 작성한 개발일지 [FINISH]")
    @GetMapping("/diaries/today")
    public ResponseEntity<TodayDiaryListResponse> getTodayDiary() {
        return ResponseEntity.ok(diaryService.getTodayDiary());
    }

    @Operation(summary = "특정 프로젝트의 개발일지 목록 조회 [FINISH]")
    @Parameters(value = {
            @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @GetMapping("/projects/{projectId}/diaries")
    public ResponseEntity<DiaryListResponse> getAllDiaries(
            @PathVariable("projectId") Integer projectId) {
        return ResponseEntity.ok(diaryService.getAllDiaries(projectId));
    }

    @Operation(summary = "개발일지 질문 목록 조회 [FINISH]")
    @GetMapping("/diaries/questions")
    public ResponseEntity<List<QuestionResponse>> getQuestions() {
        return ResponseEntity.ok(diaryService.getQuestions());
    }

    @Operation(summary = "특정 프로젝트의 모든 개발일지 상세 조회 [FINISH]")
    @Parameters(value = {
            @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @GetMapping("/projects/{projectId}/diaries/details")
    public ResponseEntity<List<DiaryDetailResponse>> getAllDiariesDetail(
            @PathVariable("projectId") Integer projectId) {
        return ResponseEntity.ok(diaryService.getAllDiariesDetail(projectId));
    }

    @Operation(summary = "개발일지 등록 [FINISH] - Postman으로 하세요")
    @Parameters(value = {
            @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @PostMapping("/projects/{projectId}/diaries")
    public ResponseEntity<String> createDiary(
            @PathVariable("projectId") Integer projectId,
            @Valid @RequestPart("request") DiaryCreateRequest request,
            @RequestPart("files") List<MultipartFile> files) {
        diaryService.createDiary(projectId, request, files);
        return ResponseEntity.ok("개발일지가 성공적으로 생성되었습니다.");
    }

    @Operation(summary = "개발일지 상세 조회 [FINISH]")
    @Parameters(value = {
            @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH),
            @Parameter(name = "diaryId", description = "개발일지 ID", in = ParameterIn.PATH)
    })
    @GetMapping("/projects/{projectId}/diaries/{diaryId}")
    public ResponseEntity<DiaryDetailResponse> getDiaryDetail(
            @PathVariable("projectId") Integer projectId,
            @PathVariable("diaryId") Integer diaryId) {
        return ResponseEntity.ok(diaryService.getDiaryDetail(projectId, diaryId));
    }

    @Operation(summary = "개발일지 수정 [FINISH] - Postman으로 하세요")
    @Parameters(value = {
            @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH),
            @Parameter(name = "diaryId", description = "개발일지 ID", in = ParameterIn.PATH)
    })
    @PatchMapping("/projects/{projectId}/diaries/{diaryId}")
    public ResponseEntity<String> updateDiary(
            @PathVariable("projectId") Integer projectId,
            @PathVariable("diaryId") Integer diaryId,
            @Valid @RequestPart("request") DiaryUpdateRequest request,
            @RequestPart("files") List<MultipartFile> files) {
        diaryService.updateDiary(projectId, diaryId, request, files);
        return ResponseEntity.ok("개발일지가 성공적으로 수정되었습니다.");
    }

    @Operation(summary = "개발일지 삭제 [FINISH]")
    @Parameters(value = {
            @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH),
            @Parameter(name = "diaryId", description = "개발일지 ID", in = ParameterIn.PATH)
    })
    @DeleteMapping("/projects/{projectId}/diaries/{diaryId}")
    public ResponseEntity<String> deleteDiary(
            @PathVariable("projectId") Integer projectId,
            @PathVariable("diaryId") Integer diaryId) {
        diaryService.deleteDiary(projectId, diaryId);
        return ResponseEntity.ok("개발일지가 성공적으로 삭제되었습니다.");
    }
}