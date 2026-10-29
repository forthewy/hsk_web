package com.jane.hskweb.usageLimit;

import com.jane.hskweb.entity.DailyUsage;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyUsageRepository
        extends JpaRepository<DailyUsage, Long> {

    Optional<DailyUsage>
    findByUsageDateAndUsageTypeAndIdentifier(
            LocalDate usageDate,
            String usageType,
            String identifier
    );


    @Modifying
    @Query(value = """
    INSERT INTO daily_usage
        (usage_date, usage_type, identifier, request_count)
    VALUES
        (:date, :type, :identifier, 0)
    ON DUPLICATE KEY UPDATE id = id
    """, nativeQuery = true)
    void ensureRow(
            @Param("date") LocalDate date,
            @Param("type") String type,
            @Param("identifier") String identifier
    );


    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT d FROM DailyUsage d
    WHERE d.usageDate = :date
      AND d.usageType = :type
      AND d.identifier = :identifier
    """)
    Optional<DailyUsage> findForUpdate(
            @Param("date") LocalDate date,
            @Param("type") String type,
            @Param("identifier") String identifier
    );
}