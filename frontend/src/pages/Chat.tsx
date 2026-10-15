import { useEffect, useState } from "react";
import PlaceNpcSelector from "./PlaceNpcSelector";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [level, setLevel] = useState(1);
  const [place, setPlace] = useState("school");
  const [npc, setNpc] = useState("teacher");

  // 메세지 정보
  type ChatMessageInfo = {
    message: string;
    level: number;
    npc: string;
  }
  // 유저 메세지 전송
  const sendMessage = (body: ChatMessageInfo) => {
    fetch(`/api/chat/user_talk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(response => response.text())
      .then(data => {
        console.log("서버 응답:", data);
        setResponse(data);
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
            <div className="flex justify-end">
              <div className="flex flex-col items-end gap-1">
                <div className="break-words max-w-xl bg-primary-light text-white px-4 py-3 rounded-2xl rounded-br-sm">
                  {message}
                </div>
                <div className="w-10 h-10 rounded-full bg-gray flex items-center justify-center shrink-0">
                  나
                </div>
              </div>
            </div>
            {/* AI 메시지 */}
            <div className="flex justify-start items-start gap-3">
              <div className="flex flex-col items-start gap-1">
                <div className="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center shrink-0">
                  {npc}
                </div>

                <div className="break-words max-w-xl bg-secondary px-4 py-3 rounded-2xl rounded-tl-sm">
                  {response}
                </div>
              </div>
            </div>
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
                  npc: npc
                })
              }
            >입력</button>
          </div>
        </div>
      </div>
    </div>
  )

}