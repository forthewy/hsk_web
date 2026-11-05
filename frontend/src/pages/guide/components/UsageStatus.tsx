
interface UsageStatusProps {
  usedCount: number;
  dailyLimit: number;
}

export default function UsageStatus({
  usedCount,
  dailyLimit,
}: UsageStatusProps) {
  const percentage =
    dailyLimit > 0
      ? Math.min((usedCount / dailyLimit) * 100, 100)
      : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>오늘의 대화 사용량</span>
        <span className="font-bold">
          {usedCount} / {dailyLimit}회
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-primary-light"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {usedCount >= dailyLimit && (
        <p className="mt-3 text-sm text-red-500">
          오늘의 대화 횟수를 모두 사용했습니다.
        </p>
      )}
    </div>
  );
}
