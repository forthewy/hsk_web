import { useEffect, useState } from "react";
import type { QuestDefinition, QuestProgress } from "../types/chat";

export function useQuestProgress() {
  const [quests, setQuests] = useState<QuestDefinition[]>([]);
  const [questProgresses, setQuestProgresses] =
    useState<Record<string, QuestProgress>>({});

  // 퀘스트 목록 조회
  useEffect(() => {
    fetch("/api/quests")
      .then(res => {
        if (!res.ok) throw new Error("퀘스트 목록 조회 실패");
        return res.json();
      })
      .then((data: QuestDefinition[]) => {
        setQuests(data);
      })
      .catch(error => {
        console.error("퀘스트 조회 오류:", error);
      });
  }, []);

  // 퀘스트 진행 상태 갱신
  const updateQuestProgress = (progress: QuestProgress) => {
    setQuestProgresses(prev => ({
      ...prev,
      [progress.questId]: progress
    }));
  };

  // 완료 여부 확인
  const isQuestCompleted = (questId: string | null) => {
    if (!questId) return false;
    return questProgresses[questId]?.status === "COMPLETED";
  };

  return {
    quests,
    questProgresses,
    updateQuestProgress,
    isQuestCompleted
  };
}