package com.ssafy.bbogle.fcm.controller;

import com.ssafy.bbogle.fcm.dto.request.FcmSaveRequest;
import com.ssafy.bbogle.fcm.service.FcmServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fcm")
@RequiredArgsConstructor
public class FcmController {

    private final FcmServiceImpl fcmService;

    @Operation(description = "알림 권한 허용 - fcm 토큰 등록")
    @PostMapping()
    public ResponseEntity<String> saveFcm(@RequestBody FcmSaveRequest request) {
        fcmService.saveFcm(request);
        return ResponseEntity.ok("fcm 정보가 저장되었습니다.");
    }

}
