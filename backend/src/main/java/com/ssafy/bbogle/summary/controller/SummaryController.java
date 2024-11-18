package com.ssafy.bbogle.summary.controller;

import com.ssafy.bbogle.summary.dto.request.SummaryRequest;
import com.ssafy.bbogle.summary.dto.response.SummaryResponse;
import com.ssafy.bbogle.summary.service.SummaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
@Tag(name = "SummaryController", description = "회고 컨트롤러")
public class SummaryController {

    private final SummaryService summaryService;

    @Operation(summary = "회고 조회 (완료)", description = "해당 프로젝트의 회고가 아직 없다면 응답 null")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @GetMapping("/{projectId}/summary")
    public ResponseEntity<SummaryResponse> getSummary(@PathVariable("projectId") Integer projectId) {
        SummaryResponse result = summaryService.getSummary(projectId);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @Operation(summary = "회고 등록 (완료)")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @PostMapping("/{projectId}/summary")
    public ResponseEntity<String> createSummary(@PathVariable("projectId") Integer projectId,
        @RequestBody SummaryRequest request) {
        summaryService.createSummary(projectId, request);
        return ResponseEntity.status(HttpStatus.OK).body("회고 등록 성공");
    }

    @Operation(summary = "회고 수정 (완료)")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH),
        @Parameter(name = "summaryId", description = "회고 ID", in = ParameterIn.PATH)
    })
    @PatchMapping("/{projectId}/summary/{summaryId}")
    public ResponseEntity<String> updateSummary(@PathVariable("projectId") Integer projectId,
        @PathVariable("summaryId") Integer summaryId,
        @RequestBody SummaryRequest request) {
        summaryService.updateSummary(summaryId, request);
        return ResponseEntity.status(HttpStatus.OK).body("회고 수정 성공");
    }
}
