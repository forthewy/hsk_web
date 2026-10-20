package com.jane.hskweb.service;

import com.jane.hskweb.model.NpcState;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class NpcStateService {

    public NpcState nextState(
            String npcId,
            NpcState currentState,
            Map<String, Object> playerMemory,
            boolean questCompleted
    ) {
        return switch (currentState) {

            case INTRODUCTION -> {
                if (npcId.equals("student")
                        && playerMemory.containsKey("name")
                        && playerMemory.containsKey("preference")) {
                    yield NpcState.QUEST;
                }
                yield currentState;
            }

            case QUEST -> {
                if (questCompleted) {
                    yield NpcState.QUEST_COMPLETE;
                }
                yield currentState;
            }

            case PRACTICE -> currentState;

            case QUEST_COMPLETE -> NpcState.PRACTICE;
        };
    }
}