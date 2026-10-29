package com.jane.hskweb.usageLimit;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AnonymousUserService {

    public String getOrCreateId(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("anonymousId".equals(cookie.getName())) {
                    try {
                        return UUID.fromString(cookie.getValue()).toString();
                    } catch (IllegalArgumentException ignored) {
                        // 유효하지 않은 ID는 새로 발급
                    }
                }
            }
        }

        String anonymousId = UUID.randomUUID().toString();

        Cookie cookie = new Cookie("anonymousId", anonymousId);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 로컬 HTTP 개발용
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 30);

        response.addCookie(cookie);

        return anonymousId;
    }
}