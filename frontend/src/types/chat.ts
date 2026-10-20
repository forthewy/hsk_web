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
  sessionMemory: SessionMemory;
  playerMemory: PlayerMemory;
};
  // npc 메세지 응답
export type NpcChatResponse = {
  reply: string;
  translation: string;
  sessionMemory: SessionMemory;
  playerMemory: PlayerMemory;
};
 // 대화 내역 객체 (화면용)
export type ChatHistory = {
  role: "user" | "npc";
  text: string;
  translation?: string;
};
