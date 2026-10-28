package com.jane.hskweb.npc;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class NpcRepository {

    private final JdbcTemplate jdbcTemplate;
    private final JsonMapper jsonMapper;

    public List<NpcData> getNpcs() {

        String sql = """
                SELECT
                    *
                FROM npcs
                """;

        List<NpcData> results = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new NpcData(
                        rs.getString("id"),
                        rs.getString("name"),
                        rs.getString("npc_role"),
                        rs.getString("place_id"),
                        parseJsonList(rs.getString("personality")),
                        parseJsonList(rs.getString("topics")),
                        rs.getString("greeting"),
                        rs.getString("greeting_translation")
                )
        );


        return results;
    }

    private List<String> parseJsonList(String json) {
        return jsonMapper.readValue(
                json,
                new TypeReference<List<String>>() {}
        );
    }

    // npc 1명 조회
    public List<NpcData> getNpcs() {

        String sql = """
                SELECT
                    *
                FROM npcs
                WHERE id = 
                """;

        List<NpcData> results = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new NpcData(
                        rs.getString("id"),
                        rs.getString("name"),
                        rs.getString("npc_role"),
                        rs.getString("place_id"),
                        parseJsonList(rs.getString("personality")),
                        parseJsonList(rs.getString("topics")),
                        rs.getString("greeting"),
                        rs.getString("greeting_translation")
                )
        );


        return results;
    }
}