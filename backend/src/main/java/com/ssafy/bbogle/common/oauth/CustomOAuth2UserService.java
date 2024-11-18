package com.ssafy.bbogle.common.oauth;

import com.ssafy.bbogle.common.jwt.JwtUtil;
import com.ssafy.bbogle.common.util.RedisUtil;
import com.ssafy.bbogle.user.entity.User;
import com.ssafy.bbogle.user.repository.UserRepository;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RedisUtil redisUtil;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 카카오에서 받아온 사용자 정보 중 필요한 정보 추출
        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        Long kakaoId = (Long) attributes.get("id");
        String nickname = (String) profile.get("nickname");
        String email = (String) kakaoAccount.get("email");

        // DB에 User 저장
        User user = userRepository.findByKakaoId(kakaoId)
            .orElseGet(()-> User.builder()
                .kakaoId(kakaoId)
                .nickname(nickname)
                .email(email)
                .build());
        userRepository.save(user);

        return oAuth2User;
    }

}
