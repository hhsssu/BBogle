package com.ssafy.bbogle.common.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    @Value(value = "${jwt.secret}")
    private String jwtSecret;

    @Value(value = "${jwt.access-expire}")
    private Long accessExpire;

    @Value(value = "${jwt.refresh-expire}")
    private Long refreshExpire;

    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(String kakaoId){
        return generateToken(kakaoId, "access", accessExpire);
    }

    public String generateRefreshToken(String kakaoId){
        return generateToken(kakaoId, "refresh", refreshExpire);
    }

    public boolean validateToken(String token) {
        try {
            getClaimsFromToken(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw e; // 만료된 토큰 예외를 던짐
        } catch (JwtException e) {
            throw e; // 유효하지 않은 토큰 예외를 던짐
        }
    }


    public boolean isAccessToken(String token){
        Claims claims = getClaimsFromToken(token);
        return "access".equals(claims.get("type"));
    }

    public long getRefreshTokenExpire(){
        return refreshExpire;
    }

    public long getAccessTokenExpire(){
        return accessExpire;
    }

    public String getKakaoIdFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getSubject();
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(this.getSecretKey())
            .build()
            .parseClaimsJws(token).getBody();
    }

    private String generateToken(String kakaoId, String type, Long expirationTime){
        return Jwts.builder()
            .setSubject(kakaoId)
            .claim("type", type)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis()+expirationTime))
            .signWith(this.getSecretKey())
            .compact();
    }

    public String parseKakaoIdFromToken(String token) {
        try {
            // 정상적인 경우 (토큰이 만료되지 않은 상태)
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(this.getSecretKey()) // 서명 검증
                .build()
                .parseClaimsJws(token) // JWS 파싱
                .getBody();

            return claims.getSubject(); // kakaoId 추출
        } catch (ExpiredJwtException e) {
            // 만료된 토큰일 경우
            Claims claims = e.getClaims(); // 만료된 토큰에서도 Claims 추출 가능
            return claims.getSubject(); // kakaoId 추출
        }
    }

}
