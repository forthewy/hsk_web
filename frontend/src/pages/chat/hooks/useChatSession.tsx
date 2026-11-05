
import { useEffect, useRef, useState } from "react";
import type {
    ChatHistory,
    ChatMessageInfo,
    NpcChatResponse,
    PlayerMemory,
    SessionMemory,
    QuestProgress
} from "../types/chat";

interface UseChatSessionProps {
    npc: string;
    place: string;
    chatMode: string;
    questId: string | null;
    questCompleted: boolean;
    updateQuestProgress: (progress: QuestProgress) => void;
}

const createSessionMemory = (): SessionMemory => ({
    topic: null,
    facts: {},
    lastNpcQuestion: null
});

export function useChatSession({
    npc,
    place,
    chatMode,
    questId,
    questCompleted,
    updateQuestProgress
}: UseChatSessionProps) {

    // 채팅 내역 배열
    const [chatHistory, setChatHistory] =
        useState<ChatHistory[]>([]);

    // 세션 채팅 메모리 (현재 대화 요약)
    const [sessionMemory, setSessionMemory] =
        useState<SessionMemory>(createSessionMemory);

    // 장기기억 (공용)
    const [playerMemory, setPlayerMemory] =
        useState<PlayerMemory>({ facts: {} });

    // NPC 응답 대기 상태
    const [isLoading, setIsLoading] = useState(false);

    const isLoadingRef = useRef(false);

    // npc, 장소 변경시 대화 취소
    const abortControllerRef =
        useRef<AbortController | null>(null);

    // NPC, 장소, 모드, 퀘스트 변경 시 초기화
    useEffect(() => {
        setChatHistory([]);
        setSessionMemory(createSessionMemory());
        setIsLoading(false);
        isLoadingRef.current = false;

        const controller = new AbortController();

        fetch(`/api/chat/${npc}`, {
            signal: controller.signal
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("NPC 인삿말 조회 실패");
                }
                return res.json();
            })
            .then((data: {
                greeting: string;
                greetingTranslation: string;
            }) => {
                if (controller.signal.aborted) return;

                setChatHistory([{
                    role: "npc",
                    text: data.greeting,
                    translation: data.greetingTranslation
                }]);

                setSessionMemory({
                    topic: null,
                    facts: {},
                    lastNpcQuestion: data.greeting
                });
            })
            .catch(error => {
                if (error.name !== "AbortError") {
                    console.error("NPC 인삿말 오류:", error);
                }
            });

        return () => {
            controller.abort();
            abortControllerRef.current?.abort();
            abortControllerRef.current = null;
            isLoadingRef.current = false;
        };
    }, [npc, place, chatMode, questId]);

    // 사용자 메시지 전송
    const sendMessage = (body: ChatMessageInfo) => {
        // 빈 메시지 또는 응답 대기 중이면 전송하지 않음
        if (
            !body.message.trim() ||
            isLoadingRef.current ||
            questCompleted
        ) return;

        isLoadingRef.current = true;
        setIsLoading(true);

        // 대화내역에 새 메세지 추가
        setChatHistory(prev => [
            ...prev,
            { role: "user", text: body.message }
        ]);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        fetch("/api/chat/user_talk", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            signal: controller.signal
        })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 429) {
                        throw new Error(
                            "오늘의 AI 대화 횟수를 모두 사용했어요. 내일 다시 이용해 주세요."
                        );
                    }
                    throw new Error("채팅 요청 실패");
                }
                return res.json();
            })
            .then((data: NpcChatResponse) => {
                if (controller.signal.aborted) return;

                console.log("서버 퀘스트 진행 상태:", data.questProgress);
                console.log("퀘스트 상태:", data.questProgress?.status);

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
                    updateQuestProgress(data.questProgress);
                }
            })
            .catch(error => {
                if (error.name === "AbortError") return;
                console.error("채팅 오류:", error);

                setChatHistory(prev => [
                    ...prev,
                    {
                        role: "system",
                        text: error.message
                    }
                ]);
            })
            .finally(() => {
                if (abortControllerRef.current === controller) {
                    abortControllerRef.current = null;
                    isLoadingRef.current = false;
                    setIsLoading(false);
                }
            });
    };

    return {
        chatHistory,
        sessionMemory,
        playerMemory,
        isLoading,
        sendMessage
    };
}
