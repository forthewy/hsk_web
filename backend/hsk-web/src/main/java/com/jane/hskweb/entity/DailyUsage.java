package com.jane.hskweb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(
        name = "daily_usage",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_daily_usage",
                columnNames = {
                        "usage_date",
                        "usage_type",
                        "identifier"
                }
        )
)
@Getter
@NoArgsConstructor
public class DailyUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usage_date", nullable = false)
    private LocalDate usageDate;

    @Column(name = "usage_type", nullable = false, length = 20)
    private String usageType;

    @Column(nullable = false, length = 100)
    private String identifier;

    @Column(name = "request_count", nullable = false)
    private int requestCount;

    public DailyUsage(
            LocalDate usageDate,
            String usageType,
            String identifier
    ) {
        this.usageDate = usageDate;
        this.usageType = usageType;
        this.identifier = identifier;
        this.requestCount = 0;
    }

    public void increaseCount() {
        this.requestCount++;
    }
}