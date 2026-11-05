import type { ChatSelection } from "../types/chat";


type PlaceNpcSelectorProps = {
    selection: ChatSelection;
    onSelect: (selection: ChatSelection) => void;
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

// 퀘스트 수집정보
const factLabels: Record<string, string> = {
    name: "이름",
    country: "출신 국가",
    hobby: "취미",
    drink: "음료",
    temperature: "온도",
    paymentMethod: "결제 수단",
};

// 퀘스트 npc
const getNpcName = (npcId: string) => {
    return npcs.find(item => item.id === npcId)?.name ?? npcId;
};

export default function PlaceNpcSelector({
    selection,
    onSelect,
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
        </div>
    </>
}
