import type { ChatHistory } from "../types/chat"

type ChatMessageListProps = {
    history: ChatHistory[];
    npc: string;
}

export default function ChatMessageList({history, npc} : ChatMessageListProps) {
    
    return (
        <div>
            {history.map((msg, index) => (
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
    )
}