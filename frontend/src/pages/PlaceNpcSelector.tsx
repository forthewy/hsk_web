import type {
    ChatSelection,
    QuestDefinition,
    QuestProgress,
    NpcData
} from "../types/chat";


type PlaceNpcSelectorProps = {
    selection: ChatSelection;
    onSelect: (selection: ChatSelection) => void;
    quests: QuestDefinition[];
    questProgresses: Record<string, QuestProgress>;
    npcs: NpcData[];
};

// 장소
const places = [
    { id: "school", name: "학교", defaultNpc: "teacher" },
    { id: "cafe", name: "카페", defaultNpc: "clerk" },
];

// 퀘스트 수집정보
const factLabels: Record<string, string> = {
    name: "이름",
    country: "출신 국가",
    hobby: "취미",
    drink: "음료",
    temperature: "온도",
    paymentMethod: "결제 수단",
};

export default function PlaceNpcSelector({
    selection,
    onSelect,
    quests,
    questProgresses,
    npcs,
}: PlaceNpcSelectorProps) {

    // npc 이름
    const getNpcName = (npcId: string) => {
        return npcs.find(item => item.id === npcId)?.name ?? npcId;
    };
    const { place, npc, chatMode, questId } = selection;
    return <>
        <div>
            <h2>장소</h2>
            <div className="grid grid-cols-2 bg-gray-200">
                {places.map(item => (
                    <button
                        key={item.id}
                        type="button"
                        className={`w-full py-3 rounded ${place === item.id
                            ? "bg-background text-primary-light font-bold"
                            : "text-slate-500 hover:bg-white"
                            }`}
                        onClick={() => onSelect({
                            place: item.id,
                            npc: item.defaultNpc,
                            chatMode: "FREE",
                            questId: null
                        })}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
        </div >

        <div>
            <h2>대화 상대</h2>

            <div className={`grid ${place === "cafe" ? "grid-cols-1" : "grid-cols-2"
                } bg-gray-200`}>
                {npcs
                    .filter(item => item.placeId === place)
                    .map(item => (
                        <button
                            key={item.id}
                            type="button"
                            className={`w-full py-3 rounded ${npc === item.id
                                ? "bg-background text-primary-light font-bold"
                                : "text-slate-500 hover:bg-white"
                                }`}
                            onClick={() => onSelect({
                                place,
                                npc: item.id,
                                chatMode: "FREE",
                                questId: null
                            })}
                        >
                            {item.name}
                        </button>
                    ))}
            </div>
            {/* 퀘스트 목록 */}
            <div className="mt-6 border-t border-gray-300 pt-4">
                <h2 className="mb-3 gap-2 font-semibold">
                    퀘스트
                </h2>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3">
                        {quests.map(quest => {
                            const isCompleted =
                                questProgresses[quest.id]?.status === "COMPLETED";

                            return (
                                <button
                                    key={quest.id}
                                    type="button"
                                    disabled={isCompleted}
                                    className={`w-full rounded-xl p-4 text-left
                ${isCompleted
                                            ? "bg-gray-200 opacity-60 cursor-not-allowed"
                                            : chatMode === "QUEST" && questId === quest.id
                                                ? "bg-primary-lighter"
                                                : "bg-surface hover:bg-primary-lighter"
                                        }`}
                                    onClick={() => onSelect({
                                        place: quest.placeId,
                                        npc: quest.npcId,
                                        chatMode: "QUEST",
                                        questId: quest.id
                                    })}
                                >
                                    <div className="flex items-center justify-between font-semibold">
                                        <span>{quest.title}</span>

                                        {isCompleted && (
                                            <span className="text-xs text-green-700">
                                                ✓ 완료
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-sm text-secondary">
                                        {quest.description}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {quest.requiredFacts.map(fact => (
                                            <span
                                                key={fact}
                                                className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                                            >
                                                {factLabels[fact] ?? fact}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-3 text-sm text-primary font-semibold">
                                        대화 NPC: {getNpcName(quest.npcId)} →
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div >
    </>
}
