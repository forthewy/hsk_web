package com.jane.hskweb.npc;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class NpcDataProvider {

    private final JdbcTemplate jdbcTemplate;
    private final JsonMapper jsonMapper;

    public NpcData getNpc(String npcId) {

        String sql = """
                SELECT
                    id,
                    name,
                    npc_role,
                    personality,
                    topics,
                    greeting,
                    greeting_translation
                FROM npcs
                WHERE id = ?
                """;

        List<NpcData> results = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new NpcData(
                        rs.getString("id"),
                        rs.getString("name"),
                        rs.getString("npc_role"),
                        parseJsonList(rs.getString("personality")),
                        parseJsonList(rs.getString("topics")),
                        rs.getString("greeting"),
                        rs.getString("greeting_translation")
                ),
                npcId
        );

        if (results.isEmpty()) {
            throw new IllegalArgumentException(
                    "존재하지 않는 NPC입니다: " + npcId
            );
        }

        return results.get(0);
    }

    private List<String> parseJsonList(String json) {
        return jsonMapper.readValue(
                json,
                new TypeReference<List<String>>() {}
        );
    }
}