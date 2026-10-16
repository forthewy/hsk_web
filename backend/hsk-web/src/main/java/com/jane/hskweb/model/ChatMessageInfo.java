package com.jane.hskweb.model;

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
}
