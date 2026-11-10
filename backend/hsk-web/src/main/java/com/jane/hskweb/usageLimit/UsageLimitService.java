package com.jane.hskweb.usageLimit;

import com.jane.hskweb.entity.DailyUsage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UsageLimitService {

    private static final int USER_LIMIT = 7;
    private static final int GLOBAL_LIMIT = 30;

    private final DailyUsageRepository repository;

    @Transactional
    public void reserveUsage(String anonymousId) {

        LocalDate today = LocalDate.now(
                ZoneId.of("Asia/Seoul")
        );

        List<UsageTarget> targets = List.of(
                new UsageTarget("GLOBAL", "ALL", GLOBAL_LIMIT, 2),
                new UsageTarget("USER", anonymousId, USER_LIMIT, 1)
        );

        // 행이 없으면 먼저 생성
        for (UsageTarget target : targets) {
            repository.ensureRow(
                    today,
                    target.type(),
                    target.identifier()
            );
        }

        // 고정 순서로 잠금 획득
        List<DailyUsage> usages = targets.stream()
                .map(target -> repository.findForUpdate(
                        today,
                        target.type(),
                        target.identifier()
                ).orElseThrow())
                .toList();

        // 모든 제한 검사
        for (int i = 0; i < targets.size(); i++) {

            UsageTarget target = targets.get(i);
            DailyUsage usage = usages.get(i);

            if (usage.getRequestCount() + target.amount()
                    > target.limit()) {

                throw new ResponseStatusException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        "오늘의 AI 사용량 제한을 초과했습니다."
                );
            }
        }

        // 모든 제한을 통과한 경우에만 증가
        for (int i = 0; i < targets.size(); i++) {

            DailyUsage usage = usages.get(i);
            int amount = targets.get(i).amount();

            for (int j = 0; j < amount; j++) {
                usage.increaseCount();
            }
        }
    }

    private record UsageTarget(
            String type,
            String identifier,
            int limit,
            int amount
    ) {}



    @Transactional(readOnly = true)
    public UsageStatusResponse getUsageStatus(String anonymousId) {
        LocalDate today = LocalDate.now(
                ZoneId.of("Asia/Seoul")
        );

        int usedCount = repository
                .findByUsageDateAndUsageTypeAndIdentifier(
                        today, "USER", anonymousId
                )
                .map(DailyUsage::getRequestCount)
                .orElse(0);

        return new UsageStatusResponse(
                usedCount,
                USER_LIMIT
        );
    }

    @Scheduled(cron = "0 0 3 * * *", zone = "Asia/Seoul")
    @Transactional
    public void deleteOldUsage() {

        LocalDate cutoff = LocalDate.now(
                ZoneId.of("Asia/Seoul")
        ).minusDays(30);

        long deletedCount = repository.deleteByUsageDateBefore(cutoff);

        log.info("오래된 사용량 기록 삭제: {}건", deletedCount);
    }
}