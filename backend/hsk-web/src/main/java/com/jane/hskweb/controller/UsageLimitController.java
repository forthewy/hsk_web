package com.jane.hskweb.controller;

import com.jane.hskweb.usageLimit.AnonymousUserService;
import com.jane.hskweb.usageLimit.UsageLimitService;
import com.jane.hskweb.usageLimit.UsageStatusResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usage")
@RequiredArgsConstructor
public class UsageLimitController {

    private final UsageLimitService usageLimitService;
    private final AnonymousUserService anonymousUserService;

    @GetMapping("/today")
    public UsageStatusResponse getTodayUsage(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String anonymousId =
                anonymousUserService.getOrCreateId(request, response);

        return usageLimitService.getUsageStatus(anonymousId);
    }
}