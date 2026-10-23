export type QuestStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED";

export type QuestProgress = {
  questId: string;
  status: QuestStatus;
  collectedFacts: Record<string, string>;
};

// npc, quest 선택지
export type ChatSelection = {
  place: string;
  npc: string;
  chatMode: "FREE" | "QUEST";
  questId: string | null;
};

// 퀘스트 타입
export type QuestDefinition = {
  id: string;
  npcId: string;
  placeId: string;
  title: string;
  description: string;
  npcFacts: Record<string, string>;
  requiredFacts: string[];
};

// 세션 대화 메모리 (대화용)
export type SessionMemory = {
  topic: string | null;
  facts: Record<string, string>;
  lastNpcQuestion: string | null;
};

// 장기 기억 (공용)
export type PlayerMemory = {
  facts: Record<string, string>;
};
// 보내는 메세지 정보
export type ChatMessageInfo = {
  message: string;
  level: number;
  npc: string;
  chatMode: "FREE" | "QUEST";
  questId: string | null;
  sessionMemory: SessionMemory;
  playerMemory: PlayerMemory;
  questProgress: QuestProgress | null;
};

// npc 메세지 응답
export type NpcChatResponse = {
  reply: string;
  translation: string;
  sessionMemory: SessionMemory;
  playerMemory: PlayerMemory;
  questProgress: QuestProgress | null;
};
// 대화 내역 객체 (화면용)
export type ChatHistory = {
  role: "user" | "npc";
  text: string;
  translation?: string;
};
