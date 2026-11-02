import { useEffect, useState } from "react";
import PlaceNpcSelector from "./components/PlaceNpcSelector";
import LevelSelector from "./components/LevelSelector";
import ChatMessageList from "./components/ChatMessageList";
import { useChatSelection } from "./hooks/useChatSelection";
import { useQuestProgress } from "./hooks/useQuestProgress";
import ChatInput from "./components/ChatInput";
import { useChatSession } from "./hooks/useChatSession";
import ChatQuestStatus from "./components/ChatQuestStatus";


export default function Chat() {

  // 컴포넌트
  const { selection, setSelection } = useChatSelection();

  const {
    quests,
    questProgresses,
    updateQuestProgress,
    isQuestCompleted
  } = useQuestProgress();


  const { place, npc, chatMode, questId } = selection;

  const questCompleted =
    chatMode === "QUEST" && isQuestCompleted(questId);

  const {
    chatHistory,
    sessionMemory,
    playerMemory,
    isLoading,
    sendMessage
  } = useChatSession({
    npc,
    place,
    chatMode,
    questId,
    questCompleted,
    updateQuestProgress
  });

  // 입력중 메세지
  const [message, setMessage] = useState("");

  const [level, setLevel] = useState(1);

  const handleSubmit = () => {
    if (!message.trim() || isLoading || questCompleted) return;

    sendMessage({
      message,
      level,
      npc,
      chatMode,
      questId,
      sessionMemory,
      playerMemory,
      questProgress:
        chatMode === "QUEST" && questId
          ? questProgresses[questId] ?? null
          : null
    });

    setMessage("");
  };

  useEffect(() => {
    setMessage("");
  }, [npc, place, chatMode, questId]);

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
          questProgresses={questProgresses}
        />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">

        {/* 레벨 선택 */}
        <LevelSelector level={level} onChange={setLevel} />

        {/* 채팅창 */}
        <div className="min-h-0 flex-1 bg-slate-50 rounded-2xl border border-slate-100 px-6 py-5 overflow-y-auto">
          <div className="flex flex-col  flex-1  gap-6">
            {/* 퀘스트 진행상태 */}
            <ChatQuestStatus
              chatMode={chatMode}
              questCompleted={questCompleted}
              progress={questId ? questProgresses[questId] ?? null : null}
            />
            {/* 채팅 내역 */}
            <ChatMessageList
              history={chatHistory}
              npc={npc}
            />
          </div>
        </div>
        <div className="h-24 bg-background">
          <ChatInput
            message={message}
            onMessageChange={setMessage}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            questCompleted={questCompleted}
          />
        </div>
      </div>
    </div>
  )
}