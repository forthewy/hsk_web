import { useEffect, useState, useRef } from "react";
import PlaceNpcSelector from "./PlaceNpcSelector";
import type {
  ChatHistory,
  ChatMessageInfo,
  NpcChatResponse,
  PlayerMemory,
  SessionMemory,
  ChatSelection,
  QuestDefinition,
  QuestProgress
} from "../types/chat";


export default function Chat() {

  const [selection, setSelection] = useState<ChatSelection>({
    place: "school",
    npc: "teacher",
    chatMode: "FREE",
    questId: null
  });
  const [quests, setQuests] = useState<QuestDefinition[]>([]);
  const [questProgresses, setQuestProgresses] =
    useState<Record<string, QuestProgress>>({});

  const { place, npc, chatMode, questId } = selection;
  // 입력중 메세지
  const [message, setMessage] = useState("");
  // 채팅 내역 배열
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  // 세션 채팅 메모리 (현재 대화 요약)
  const [sessionMemory, setSessionMemory] = useState<SessionMemory>({
    topic: null,
    facts: {},
    lastNpcQuestion: null,
  });
  // 장기기억 (공용)
  const [playerMemory, setPlayerMemory] = useState<PlayerMemory>({
    facts: {}
  });
  const [level, setLevel] = useState(1);
  // NPC 응답 대기 상태
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  // npc, 장소 변경시 대화 취소
  const abortControllerRef = useRef<AbortController | null>(null);
  // 세션 메모리 리셋
  const resetSessionMemory = () => {
    setSessionMemory({
      topic: null,
      facts: {},
      lastNpcQuestion: null,
    });
  };

  // npc, 장소 변경시 대화 초기화
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      isLoadingRef.current = false;
    };
  }, [npc, place, chatMode, questId]);

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

  useEffect(() => {
    setChatHistory([]);
    resetSessionMemory();
    setIsLoading(false);
  }, [npc, place, chatMode, questId]);

  // 유저 메세지 전송
  const sendMessage = (body: ChatMessageInfo) => {
    // 빈 메시지 또는 응답 대기 중이면 전송하지 않음
    if (!body.message.trim() || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    // 대화내역에 새 메세지 추가
    setChatHistory(prev => [
      ...prev,
      { role: "user", text: body.message }
    ]);

    setMessage("");

    const controller = new AbortController();
    abortControllerRef.current = controller;

    fetch(`/api/chat/user_talk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error("채팅 요청 실패");
        return res.json();
      })
      .then((data: NpcChatResponse) => {
        if (controller.signal.aborted) return;

        setChatHistory(prev => [
          ...prev,
          {
            role: "npc",
            text: data.reply,
            translation: data.translation
          }
        ]);

        setSessionMemory(data.sessionMemory);
        setPlayerMemory(data.playerMemory);
        if (data.questProgress) {
          setQuestProgresses(prev => ({
            ...prev,
            [data.questProgress!.questId]: data.questProgress!
          }));
        }
      })
      .catch(error => {
        if (error.name === "AbortError") return;

        console.error("채팅 오류:", error);
      })
      .finally(() => {
        // 현재 요청일 때만 로딩 상태 해제
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
          isLoadingRef.current = false;
          setIsLoading(false);
        }
      });
  };


  return (
    <div className="mx-auto flex h-full max-w-7xl gap-6 px-6">
      <div className="w-80  p-4 shrink-0 bg-slate-100">
        <h2 className="text-lg font-semibold">
          AI CHAT
        </h2>
        {/* npc, 장소, 퀘스트 선택 */}
        <PlaceNpcSelector
          selection={selection}
          onSelect={setSelection}
          quests={quests}
        />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
        <div className="h-32 bg-background px-6 py-4">
          <div>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5, 6].map((levelItem) => (
                <button
                  key={levelItem}
                  onClick={() => setLevel(levelItem)}
                  className={
                    level === levelItem
                      ? "bg-primary-light text-white  font-semibold px-6 py-2 m-2 rounded whitespace-nowrap"
                      : "bg-gray font-semibold px-6 py-2 m-2 rounded whitespace-nowrap"
                  }
                >
                  HSK {levelItem}급
                </button>
              ))}
            </div>
            <div>대화 주제</div>
          </div>
        </div>
        {/* 채팅창 */}
        <div className="min-h-0 flex-1 bg-slate-50 rounded-2xl border border-slate-100 px-6 py-5 overflow-y-auto">
          <div className="flex flex-col  flex-1  gap-6">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div className="flex flex-col gap-1 max-w-xl">
                  <div
                    className={`break-words px-4 py-3 rounded-2xl ${msg.role === "user"
                      ? "bg-primary-light text-white rounded-br-sm"
                      : "bg-secondary rounded-tl-sm"
                      }`}
                  >
                    <p>{msg.text}</p>

                    {msg.translation && (
                      <p className="mt-2 text-sm opacity-70">
                        {msg.translation}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-gray-500">
                    {msg.role === "user" ? "나" : npc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-24 bg-background">
          INPUT

          <form
            className="border-lg flex shadow-lg"
            onSubmit={(e) => {
              e.preventDefault();

              sendMessage({
                message: message,
                level: level,
                npc: npc,
                chatMode: chatMode,
                questId: questId,
                sessionMemory: sessionMemory,
                playerMemory: playerMemory,
                questProgress:
                  chatMode === "QUEST" && questId
                    ? questProgresses[questId] ?? null
                    : null
              });
            }}
          >
            <input
              className="flex-1 bg-white rounded-lg outline-none pl-3 py-3"
              placeholder="대화를 입력해주세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="bg-primary-light text-white rounded-r w-20 hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "대기 중" : "입력"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )

}