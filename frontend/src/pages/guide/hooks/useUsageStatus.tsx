
import { useEffect, useState } from "react";

interface UsageStatusResponse {
  usedCount: number;
  dailyLimit: number;
}

export function useUsageStatus() {
  const [usage, setUsage] = useState<UsageStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch("/api/usage/today");

        if (!response.ok) {
          throw new Error("사용량 조회 실패");
        }

        const data: UsageStatusResponse = await response.json();
        setUsage(data);
      } catch {
        setError("사용량을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  }, []);

  return { usage, isLoading, error };
}
