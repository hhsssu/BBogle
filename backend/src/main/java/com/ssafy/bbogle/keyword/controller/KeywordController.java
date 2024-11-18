package com.ssafy.bbogle.keyword.controller;

import com.ssafy.bbogle.keyword.dto.response.KeywordListResponse;
import com.ssafy.bbogle.keyword.service.KeywordServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/keywords")
@RequiredArgsConstructor
public class KeywordController {


    private final KeywordServiceImpl keywordService;

    @Operation(summary = "키워드 조회 (완료)", description = "type -> false:기술, true:인성")
    @GetMapping()
    public ResponseEntity<KeywordListResponse> getAllKeywords() {
        KeywordListResponse result = keywordService.getKeywordInfo();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
