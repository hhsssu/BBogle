package com.ssafy.bbogle.summary.controller;

import com.ssafy.bbogle.summary.dto.request.SummaryRequest;
import com.ssafy.bbogle.summary.dto.response.SummaryResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "SummaryController", description = "회고 컨트롤러")
public class SummaryController {

    @Operation(summary = "회고 조회")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @GetMapping("/{projectId}/summary")
    public ResponseEntity<SummaryResponse> getSummary(@PathVariable("projectId") Integer projectId) {
        return null;
    }

    @Operation(summary = "회고 수동 등록")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH)
    })
    @PostMapping("/{projectId}/summary")
    public ResponseEntity<String> createSummary(@PathVariable("projectId") Integer projectId,
        @RequestBody SummaryRequest request) {
        return null;
    }

    @Operation(summary = "회고 수정")
    @Parameters(value = {
        @Parameter(name = "projectId", description = "프로젝트 ID", in = ParameterIn.PATH),
        @Parameter(name = "summaryId", description = "회고 ID", in = ParameterIn.PATH)
    })
    @PatchMapping("/{projectId}/summary/{summaryId}")
    public ResponseEntity<String> updateSummary(@PathVariable("projectId") Integer projectId,
        @PathVariable("summaryId") Integer summaryId,
        @RequestBody SummaryRequest request) {
        return null;
    }
}
