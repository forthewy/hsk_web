package com.jane.hskweb.controller;

import com.jane.hskweb.usageLimit.UsageLimitService;
import com.jane.hskweb.usageLimit.UsageStatusResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usage")
@RequiredArgsConstructor
public class UsageLimitController {

    private final UsageLimitService usageLimitService;

    @GetMapping("/today")
    public UsageStatusResponse getTodayUsage(
            HttpServletRequest request
    ) {
        String ip = request.getRemoteAddr();

        return usageLimitService.getUsageStatus(ip);
    }
}
