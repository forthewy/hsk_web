import type {
    ChatSelection,
    QuestDefinition,
    QuestProgress
} from "../types/chat";

type QuestListProps = {
    selection: ChatSelection;
    onSelect: (selection: ChatSelection) => void;
    quests: QuestDefinition[];
    questProgresses: Record<string, QuestProgress>;
};

const npcNames: Record<string, string> = {
    teacher: "선생님",
    student: "학생",
    clerk: "점원",
};

const getNpcName = (npcId: string) => {
    return npcNames[npcId] ?? npcId;
};

// 퀘스트 수집정보
const factLabels: Record<string, string> = {
    name: "이름",
    country: "출신 국가",
    hobby: "취미",
    drink: "음료",
    temperature: "온도",
    paymentMethod: "결제 수단",
};

export default function QuestList({
    selection,
    onSelect,
    quests,
    questProgresses
}: QuestListProps) {
    const { chatMode, questId } = selection;

    return (
        <div className="mt-6 border-t border-gray-300 pt-4">
            <h2 className="mb-3 gap-2 font-semibold">
                퀘스트
            </h2>
            <div className="flex flex-col gap-3">
                {quests.map(quest => {
                    const progress = questProgresses[quest.id];

                    const completedFacts = quest.requiredFacts.filter(
                        fact => Boolean(progress?.collectedFacts[fact]?.trim())
                    );

                    const total = quest.requiredFacts.length;
                    const completed = completedFacts.length;

                    const percentage = total > 0
                        ? (completed / total) * 100
                        : 0;


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
                            </div>
                            <div className="mt-3 flex flex-col gap-2">
                                <div className="w-full">
                                    <div className="mb-2 flex justify-between text-xs">
                                        <span>진행도</span>
                                        <span>{completed} / {total}</span>
                                    </div>

                                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {quest.requiredFacts.map(fact => {
                                        const collected = completedFacts.includes(fact);

                                        return (
                                            <span
                                                key={fact}
                                                className={`rounded-md px-2 py-1 text-xs ${collected
                                                    ? "bg-gray-100 text-gray-400 line-through"
                                                    : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {factLabels[fact] ?? fact}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-3 text-sm text-primary font-semibold">
                                대화 NPC: {getNpcName(quest.npcId)} →
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}