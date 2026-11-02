import type { QuestProgress } from "../types/chat";
interface ChatQuestStatusProps {
    chatMode: string;
    questCompleted: boolean;
    progress: QuestProgress | null;
}

export default function ChatQuestStatus({
    chatMode,
    questCompleted,
    progress
}: ChatQuestStatusProps) {
    if (chatMode !== "QUEST") {
        return null;
    }

  if (questCompleted) {
    return (
      <div className="mx-auto w-full max-w-md rounded-xl border border-green-200 bg-green-50 p-5 text-center">
        <div className="text-lg font-bold text-green-700">
          퀘스트 완료!
        </div>

        <p className="mt-2 text-sm text-gray-600">
          필요한 정보를 모두 수집했습니다.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          다른 퀘스트를 선택하거나 자유 대화를 시작하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto rounded-xl flex justify-center items-center py-4 bg-primary-lightest">
      <div className="font-semibold">
        퀘스트 진행 중 : 
      </div>

      <p className="font-semibold pl-2">
        NPC와 중국어로 대화하며 퀘스트를 완료해 보세요.
      </p>

      {progress && (
        <p className="mt-2 text-xs text-gray-500">
          상태: {progress.status}
        </p>
      )}
    </div>
  );
}