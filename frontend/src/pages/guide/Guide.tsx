
import { Link } from "react-router-dom";
import { useUsageStatus } from "./hooks/useUsageStatus";
import UsageStatus from "./components/UsageStatus";

export default function Guide() {
  const { usage, isLoading, error } = useUsageStatus();

  return (
    <div className="bg-background px-6 py-8">
      <div className="mx-auto max-w-4xl">

        {/* 소개 */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold">
            HSK 중국어 회화 연습
          </h1>
          <p className="mb-5 text-gray-600">
            다양한 NPC와 대화하며 중국어를 연습해 보세요.
          </p>
          <Link
            to="/chat"
            className="rounded-lg bg-primary-light px-6 py-3 font-semibold text-white"
          >
            회화 시작하기 →
          </Link>
        </div>

        {/* 대화 방식 */}
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-lg font-bold">
              자유 대화
            </h2>
            <div className="space-y-3 text-sm leading-6 text-gray-600">
              <p>
                장소와 NPC를 선택해 자유롭게 대화합니다.
              </p>

              <p>
                <strong className="text-gray-900">단기 기억</strong>
                은 현재 대화의 맥락을 유지하며,
                <strong className="text-gray-900"> 장기 기억</strong>
                은 이름과 같은 사용자 정보를 유지합니다.
              </p>

              <p>
                NPC, 장소, 퀘스트 변경 시
                <strong className="text-gray-900">
                  단기 기억은 초기화
                </strong>
                되고
                <strong className="text-gray-900">
                  , 장기 기억은 유지
                </strong>
                됩니다.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-lg font-bold">
              퀘스트 회화
            </h2>
            <p className="text-sm leading-6 text-gray-600">
              주어진 상황에서 NPC와 대화하며
              필요한 정보를 전달하면 퀘스트가 완료됩니다.
            </p>
          </div>
        </div>

        {/* 이용 안내 */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-bold">
            이용 안내 (한 IP 당 하루 7회 사용)
          </h2>

          <p className="mb-4 text-sm text-gray-600">
            한국어 입력도 가능합니다.
            메시지당 최대 50자로 제한됩니다.
            
          </p>

          {isLoading && <p>사용량 조회 중...</p>}

          {error && <p className="text-red-500">{error}</p>}

          {usage && (
            <UsageStatus
              usedCount={usage.usedCount}
              dailyLimit={usage.dailyLimit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
