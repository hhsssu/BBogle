package com.ssafy.bbogle.auth.controller;

import com.ssafy.bbogle.auth.dto.response.NewTokenResponse;
import com.ssafy.bbogle.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "AuthController", description = "토큰 없이 요청 가능")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "토큰 재발급 (완료)")
    @GetMapping("/refresh")
    public ResponseEntity<NewTokenResponse> refreshToken(
        HttpServletRequest request, HttpServletResponse response) {
        NewTokenResponse result = authService.refreshToken(request, response);
        if (result == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
