import { useEffect, useState } from "react";
import PlaceNpcSelector from "./PlaceNpcSelector";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [level, setLevel] = useState(1);
  const [place, setPlace] = useState("");
  const [npc, setNpc] = useState("");

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
        "Content-Type" : "application/json", 
      },
      body: JSON.stringify(body),
    })
      .then(response => response.text())
      .then(data => setResponse(data))
  };


  return (
    <div className="flex">
      <div>
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
      <div>
        <div className="h-32 bg-background px-6 py-4">

          <div>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5, 6].map((levelItem) => (
                <button
                  key={levelItem}
                  onClick={() => setLevel(levelItem)}
                  className={
                    level === levelItem
                      ? "bg-primary-light text-white  font-semibold px-8 py-3 m-2 rounded"
                      : "bg-gray font-semibold px-8 py-3 m-2 rounded"
                  }
                >
                  HSK {levelItem}급
                </button>
              ))}
            </div>
            <div>대화 주제</div>
          </div>
        </div>
        <div className="h-96 bg-surface">
          <div>사용자: {message}</div>
          <div>AI: {response}</div>
        </div>
        <div className="h-24 bg-background">
          INPUT
          <div>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={() =>
              sendMessage({
                message: message,
                level: level,
                npc: npc
              })
            }
            >전송</button>
          </div>
        </div>
      </div>
    </div>
  )

}