package com.jane.hskweb.model;

import com.jane.hskweb.quest.QuestProgress;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChatMessageInfo {
    private String message;
    private int level;
    private String npc;
    private SessionMemory sessionMemory;
    private PlayerMemory playerMemory;
    private ChatMode chatMode = ChatMode.FREE;
    private String questId;
    private QuestProgress questProgress;
}
