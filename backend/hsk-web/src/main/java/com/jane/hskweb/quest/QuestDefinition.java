package com.jane.hskweb.quest;

import java.util.List;
import java.util.Map;

public record QuestDefinition(
        String id,
        String npcId,
        String placeId,
        String title,
        String description,
        Map<String, String> npcFacts,
        List<String> requiredFacts
) {}