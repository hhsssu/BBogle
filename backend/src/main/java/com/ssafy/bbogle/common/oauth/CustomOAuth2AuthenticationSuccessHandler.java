package com.ssafy.bbogle.common.oauth;

import com.ssafy.bbogle.common.jwt.JwtUtil;
import com.ssafy.bbogle.common.util.RedisUtil;
import com.ssafy.bbogle.user.entity.User;
import com.ssafy.bbogle.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@RequiredArgsConstructor
public class CustomOAuth2AuthenticationSuccessHandler extends
    SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RedisUtil redisUtil;

    @Value("${login.success.redirect}")
    private String loginSuccessRedirect;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        Map<String, Object> attributes = oAuth2User.getAttributes();
        Long kakaoId = (Long) attributes.get("id");
        User user = userRepository.findByKakaoId(kakaoId).orElseThrow();

        // 토큰 발급
        String accessToken = jwtUtil.generateAccessToken(user.getKakaoId().toString());
        String refreshToken = jwtUtil.generateRefreshToken(user.getKakaoId().toString());

        // 리프레시 토큰 저장
        redisUtil.saveRefresh(user.getKakaoId().toString(), refreshToken, jwtUtil.getRefreshTokenExpire());

        // 리프레시 토큰 전달
        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setSecure(true);
        refreshCookie.setMaxAge(5259400);
        response.addCookie(refreshCookie);

        // 액세스 토큰 전달
        Cookie accessCookie = new Cookie("accessToken", accessToken);
        accessCookie.setPath("/");
        accessCookie.setSecure(true);
        response.addCookie(accessCookie);

        String redirectUrl = UriComponentsBuilder.fromUriString(loginSuccessRedirect)
                .queryParam("login", true)
                    .build().encode().toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);

    }
}
