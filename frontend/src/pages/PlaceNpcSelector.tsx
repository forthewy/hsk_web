import type { ChatSelection, QuestDefinition } from "../types/chat";


type PlaceNpcSelectorProps = {
    selection: ChatSelection;
    onSelect: (selection: ChatSelection) => void;
    quests: QuestDefinition[];
};

// 장소
const places = [
    { id: "school", name: "학교", defaultNpc: "teacher" },
    { id: "cafe", name: "카페", defaultNpc: "clerk" },
];

// npc 들
const npcs = [
    { id: "teacher", name: "선생님", placeId: "school" },
    { id: "student", name: "학생", placeId: "school" },
    { id: "clerk", name: "점원", placeId: "cafe" },
];

// 퀘스트 npc
const getNpcName = (npcId: string) => {
    return npcs.find(item => item.id === npcId)?.name ?? npcId;
};

export default function PlaceNpcSelector({
    selection,
    onSelect,
    quests,
}: PlaceNpcSelectorProps) {

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
                        {quests.map(quest => (
                            <button
                                key={quest.id}
                                type="button"
                                className={`w-full rounded-xl p-4 text-left
                                ${chatMode === "QUEST" && questId === quest.id
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
                                <div className="font-semibold">
                                    {quest.title}
                                </div>

                                <p className="mt-1 text-sm text-secondary">
                                    {quest.description}
                                </p>

                                <div className="mt-3 text-sm text-primary font-semibold">
                                    대화 NPC: {getNpcName(quest.npcId)} →
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    </>
}
