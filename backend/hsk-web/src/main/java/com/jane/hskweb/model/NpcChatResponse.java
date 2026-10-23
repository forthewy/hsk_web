package com.jane.hskweb.model;

import com.jane.hskweb.quest.QuestProgress;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NpcChatResponse {
    private String translation;
    private String reply;
    private SessionMemory sessionMemory;
    private PlayerMemory playerMemory;
    private QuestProgress questProgress;
}
