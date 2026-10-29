import { useState } from "react";
import type { ChatSelection} from "../types/chat";

const INITIAL_SELECTION: ChatSelection = {
  place: "school",
  npc: "teacher",
  chatMode: "FREE",
  questId: null,
};


export function useChatSelection() {

    const [selection, setSelection] = useState<ChatSelection>(INITIAL_SELECTION);

    return {selection, setSelection};
}