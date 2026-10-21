package com.jane.hskweb.npc;

import java.util.List;

public record NpcData(
        String id,
        String name,
        String role,
        List<String> personalities,
        List<String> topics
) {
}