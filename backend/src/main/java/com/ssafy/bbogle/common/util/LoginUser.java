package com.ssafy.bbogle.common.util;

import org.springframework.security.core.context.SecurityContextHolder;

public class LoginUser {

    static public Long getKakaoId(){
        return Long.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
    }

}
