package com.jane.hskweb.model;

import java.util.List;

public record NpcData(
        String id,
        String name,
        String role,
        List<String> personalities,
        List<String> topics
) {
}