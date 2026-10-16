import { useEffect, useState } from "react";
import PlaceNpcSelector from "./PlaceNpcSelector";

export default function Chat() {
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
  const [level, setLevel] = useState(1);
  const [place, setPlace] = useState("school");
  const [npc, setNpc] = useState("teacher");

  // 보내는 메세지 정보
  type ChatMessageInfo = {
    message: string;
    level: number;
    npc: string;
    sessionMemory: SessionMemory;
  }
  // npc 메세지 응답
  type NpcChatResponse = {
    reply: string;
    translation: string;
  };
  // 대화 내역 객체 (화면용)
  type ChatHistory = {
    role: "user" | "npc";
    text: string;
    translation?: string;
  };
  // 세션 대화 메모리 (대화용)
  type SessionMemory = {
    topic: string | null;
    facts: Record<string, string>;
    lastNpcQuestion: string | null;
  };

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
    setChatHistory([]);
    resetSessionMemory();
  }, [npc, place]);

  // 유저 메세지 전송
  const sendMessage = (body: ChatMessageInfo) => {
    // 빈 메세지는 return
    if (!body.message.trim()) return;

    // 대화내역에 새 메세지 추가
    setChatHistory(prev => [
      ...prev,
      { role: "user", text: body.message }
    ]);

    setMessage("");

    fetch(`/api/chat/user_talk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        if (!res.ok) throw new Error("채팅 요청 실패");
        return res.json();
      })
      .then((data: NpcChatResponse) => {
        setChatHistory(prev => [
          ...prev, {
            role: "npc",
            text: data.reply,
            translation: data.translation
          }
        ]);
      })
      .catch(error => {
        console.error("채팅 오류:", error);
      });
  };


  return (
    <div className="flex">
      <div className="w-50 shrink-0 bg-slate-100">
        <h2 className="text-lg font-semibold">
          AI CHAT
        </h2>
        <PlaceNpcSelector
          place={place}
          npc={npc}
          setPlace={setPlace}
          setNpc={setNpc}
        />
      </div>
      <div className="min-w-0 flex-1">
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
        <div className="h-96 bg-surface px-6 py-5 overflow-y-auto">
          <div className="flex flex-col gap-6">
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
          <div className="border-lg flex shadow-lg">
            <input
              className="flex-1 bg-white rounded-lg outline-none pl-3 py-3 rounded-lg "
              placeholder="대화를 입력해주세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="bg-primary-light text-white rounded-r w-20 hover:bg-primary"
              onClick={() =>
                sendMessage({
                  message: message,
                  level: level,
                  npc: npc,
                  sessionMemory: sessionMemory
                })
              }
            >입력</button>
          </div>
        </div>
      </div>
    </div>
  )

}