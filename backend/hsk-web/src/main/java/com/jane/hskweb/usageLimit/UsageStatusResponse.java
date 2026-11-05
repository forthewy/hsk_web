
package com.jane.hskweb.usageLimit;

public record UsageStatusResponse(
        int usedCount,
        int dailyLimit
) {}
