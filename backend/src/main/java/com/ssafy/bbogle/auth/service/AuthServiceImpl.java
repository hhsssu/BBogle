package com.ssafy.bbogle.auth.service;

import com.ssafy.bbogle.auth.dto.response.NewTokenResponse;
import com.ssafy.bbogle.common.jwt.JwtUtil;
import com.ssafy.bbogle.common.util.RedisUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {


    private final JwtUtil jwtUtil;
    private final RedisUtil redisUtil;

    @Override
    public NewTokenResponse refreshToken(HttpServletRequest request, HttpServletResponse response) {

        String refreshToken = getRefreshTokenFromRequest(request);

        if (refreshToken == null) {
            return null;
        }

        if(!jwtUtil.validateToken(refreshToken)){
            return null;
        }

        String kakaoId = jwtUtil.getKakaoIdFromToken(refreshToken);

        if(!refreshToken.equals(redisUtil.get(kakaoId)) || redisUtil.get(kakaoId) == null){
            return null;
        }

        String newAccessToken = jwtUtil.generateAccessToken(kakaoId);
        String newRefreshToken = jwtUtil.generateRefreshToken(kakaoId);

        // 새 리프레시로 교체
        redisUtil.saveRefresh(kakaoId, newRefreshToken, jwtUtil.getRefreshTokenExpire());

        Cookie refreshCookie = new Cookie("refreshToken", newRefreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setSecure(true);
        refreshCookie.setMaxAge(5259400);
        response.addCookie(refreshCookie);

        return NewTokenResponse.builder()
            .accessToken(newAccessToken)
            .build();
    }

    public static String getRefreshTokenFromRequest(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        return Optional.ofNullable(cookies).stream().flatMap(Arrays::stream)
            .filter(cookie -> "refreshToken".equals(cookie.getName()))
            .map(Cookie::getValue)
            .findFirst()
            .orElse(null);

    }
}
