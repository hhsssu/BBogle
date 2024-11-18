package com.ssafy.bbogle.auth.service;

import com.ssafy.bbogle.auth.dto.response.NewTokenResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    NewTokenResponse refreshToken(HttpServletRequest request, HttpServletResponse response);

}
